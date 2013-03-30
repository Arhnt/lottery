package Service::Game;
use strict;
use Date::Calc qw(Add_Delta_Days Mktime Localtime);


# Сервис розыгрыша
my $table = 'games';

sub new
{
  my $proto = shift;                 # извлекаем имя класса или указатель на объект
  my $class = ref($proto) || $proto; # если указатель, то взять из него имя класса
  my $self  = {};
  # Приём данных из new(param=>value)
  my %params = @_;
  foreach (keys %params)
  {
    $self->{$_} = $params{$_};
  }
  bless($self, $class);              # гибкий вызов функции bless
  return $self;
}

sub findAll
{
    my ($self) = @_;
    my $sth = $::sql->handle->prepare("SELECT * FROM `$table`");
    my $rv = $sth->execute();
    return () if($rv == 0E0);
    my @games;
    while(my $ref = $sth->fetchrow_hashref())
    {
      push(@games, new Data::Game(%$ref));
    }
    return @games;
}

sub findLastGame
{
    my ($self) = @_;
    my $sth = $::sql->handle->prepare("SELECT * FROM `$table` ORDER BY `id` DESC LIMIT 1;");
    my $rv = $sth->execute();
    return () if($rv == 0E0);
    my $ref = $sth->fetchrow_hashref();
    return new Data::Game(%$ref);
}

sub runSchedule
{
  my $self = shift;
  my $optionsService = $self->{'optionsService'};
  my $nextGame = $optionsService->get('nextGameTime');
  if($nextGame && ($nextGame < time))
  {
    print "It's time to run game\n";
    $self->makeGame();
  }
  $nextGame = $self->calcNextGameRunTime();
  $optionsService->set('nextGameTime', $nextGame);
  $optionsService->save();
}

# осуществить розыгрыша
sub makeGame
{
  my $self = shift;
  my $ticketService = $self->{'ticketService'};
  my $optionsService = $self->{'optionsService'};

  my @tickets = $ticketService->findActive();
  my $sum = $self->calculateTotalSum(@tickets);

  # get lucky numbers
  my @luckyNumbers = $self->getLuckyNumbers();

  my $game = new Data::Game(
    max_number => $optionsService->get('maxNumber'), 
    count_numbers => $optionsService->get('maxNumbers'), 
    lucky_numbers => join(',', @luckyNumbers),
    total_sum => $sum
  );
  $self->save($game);

  foreach my $ticket (@tickets)
  {
    # update tickets "games left"
    my $gamesLeft = $ticket->getGamesLeft() - 1;
    if($gamesLeft < 0)
    {
      $gamesLeft = 0;
    }
    $ticket->setGamesLeft($gamesLeft);
    $ticketService->save($ticket);

    # calculate how many numbers were guesed for each tickets
    my $guessed = $ticketService->calcGuessed($ticket, @luckyNumbers);
    # write a table ticket number, guessed numbers, user id, game id
    $self->saveGameHistory($game, $ticket, $guessed);
  }

  # calculate and save budget values for the game
  $self->saveBudget($game);

  # cleanup
  # remove all unpaid sessions with no tickets with age > 1 day
}

# Calculate total sum for the game
sub calculateTotalSum
{
  my $self = shift;
  my $sum = 0;
  my @tickets = @_;
  my $sessionService = $self->{'sessionService'};
  my %sessions;

  foreach my $ticket (@tickets)
  {
    my $sessionId = $ticket->getSessionId();
    if(!$sessions{$sessionId})
    {
      $sessions{$sessionId} = $sessionService->findById($sessionId);
    }
    $sum += $sessions{$sessionId}->getGamePrice();
  }
  return $sum;
}

# Получить числа розыгрыша
# Их опций и установить их на пустое значение
# или сгенерировать случайно
sub getLuckyNumbers
{
  my $self = shift;
  my $optionsService = $self->{'optionsService'};
  my $max = $optionsService->get('maxNumber');
  my $length = $optionsService->get('maxNumbers');

  my @numbers = split(',', $optionsService->get('luckyNumbers'));
  if(scalar @numbers == $length )
  {
    $optionsService->set('luckyNumbers', '');
    $optionsService->save();
  }
  else
  {
    @numbers = ();
    my %addedNumbers;
    my @chars = (1..$max);
    foreach (1..$length)
    {
      my $num;
      do
      {
        $num = $chars[rand @chars];
      } until(!$addedNumbers{$num});
      $addedNumbers{$num} = $num;
    }
    @numbers = sort {$a<=>$b} keys %addedNumbers;
  }
  return @numbers;
}

sub save 
{
  my ($self, $game) = @_;
  if(!$game->getId())
  {
    my $sth = $::sql->handle->prepare("INSERT INTO `games` (`date`, `lucky_numbers`, `sum`, `max_number`, `count_numbers`) VALUES (NOW(), ?, ?, ?, ?)");
    $sth->execute($game->getLuckyNumbers(), $game->getTotalSum(), $game->getMaxNumber(), $game->getCountNumbers());
    $game->setId($::sql->handle->{'mysql_insertid'});
  }
}

sub saveGameHistory
{
  my ($self, $game, $ticket, $guessed) = @_;
  my $sth = $::sql->handle->prepare("INSERT INTO `game_history` (`game_id`, `ticket_id`, `guessed`) VALUES (?, ?, ?)");
  $sth->execute($game->getId(), $ticket->getId(), $guessed);
}

sub findGameHistory
{
  my ($self, $gameId) = @_;
  my $sth = $::sql->handle->prepare("SELECT `game_history`.`id`, `game_id`, `numbers`, `guessed`, `users`.`asfn_id` "
                                  . "FROM `game_history` "
                                  . "JOIN `tickets` ON `game_history`.`ticket_id` = `tickets`.`id` "
                                  . "JOIN `game_sessions` ON `tickets`.`session_id` = `game_sessions`.`id` "
                                  . "JOIN `users` ON `game_sessions`.`user_id` = `users`.`id` "
                                  . "WHERE `game_id` = ? ");
  my $rv = $sth->execute($gameId);
  return () if($rv == 0E0);
  my @tickets;
  while(my $ref = $sth->fetchrow_hashref())
  {
    push(@tickets, $ref);
  }
  return @tickets;
}

sub findWinners
{
  my ($self, $gameId) = @_;
  my $sth = $::sql->handle->prepare("SELECT `users`.`asfn_id` FROM `game_history` "
                                  . "JOIN `tickets` ON `game_history`.`ticket_id` = `tickets`.`id` "
                                  . "JOIN `game_sessions` ON `tickets`.`session_id` = `game_sessions`.`id` "
                                  . "JOIN `users` ON `game_sessions`.`user_id` = `users`.`id` "
                                  . " WHERE `game_id` = ?"
                                  . " AND `guessed` IN (SELECT MAX(`guessed`) FROM `game_history` WHERE `game_id` = ?)");
  my $rv = $sth->execute($gameId, $gameId);
  return () if($rv == 0E0);
  my @users;
  while(my $ref = $sth->fetchrow_hashref())
  {
    push(@users, $ref->{'asfn_id'});
  }
  return join(',', @users);
}

sub saveBudget
{
  my ($self, $game) = @_;
  my $sum = $game->getTotalSum();
  my $optionsService = $self->{'optionsService'};
  my $prize = $sum * $optionsService->get('budgetPrize') / 100;
  my $costs = $sum * $optionsService->get('budgetCosts') / 100;
  my $marketing = $sum * $optionsService->get('budgetMarketing') / 100;
  my $support = $sum * $optionsService->get('budgetSupport') / 100;
  my $profit = $sum * $optionsService->get('budgetProfit') / 100;
  my $sth = $::sql->handle->prepare("INSERT INTO `budget` (`game_id`, `sum`, `prize`, `costs`, `marketing`, `support`, `profit`) VALUES (?, ?, ?, ?, ?, ?, ?)");
  $sth->execute($game->getId(), $sum, $prize, $costs, $marketing, $support, $profit);
  
}

sub findGameBudget
{
  my ($self, $gameId) = @_;

  my $sth = $::sql->handle->prepare("SELECT * FROM `budget` WHERE `game_id` = ? LIMIT 1");
  my $rv = $sth->execute($gameId);
  return () if($rv == 0E0);
  my $ref = $sth->fetchrow_hashref();
  return $ref;

}

sub calcStatistics
{
  my ($self, $game) = @_;
  my %stat;
  for(my $num = 1; $num <= $game->getCountNumbers(); $num++)
  {
    $stat{$num} = 0;
  }
  my @history = $self->findGameHistory($game->getId());
  my $total = scalar @history;
  foreach my $ticket(@history)
  {
    my $guessed = $ticket->{'guessed'};
    $stat{$guessed}++;
  }

  my $topWasSet;
  for(my $num = $game->getCountNumbers(); $num > 0;  $num--)
  {
    if($stat{$num})
    {
      if($topWasSet)
      {
        $stat{$num} = sprintf("%.2f %", ($stat{$num} / $total * 100));
      }
      $topWasSet = 1;
    }
  }

  return %stat;
}

sub calcNextGameRunTime
{
  my ($self, $time) = @_;
  $time = $time || time;

  my $optionsService = $self->{'optionsService'};
  my @scheduledDays;
  push (@scheduledDays, 1) if($optionsService->get('scheduleMonday'));
  push (@scheduledDays, 2) if($optionsService->get('scheduleTuesday'));
  push (@scheduledDays, 3) if($optionsService->get('scheduleWednesday'));
  push (@scheduledDays, 4) if($optionsService->get('scheduleThursday'));
  push (@scheduledDays, 5) if($optionsService->get('scheduleFriday'));
  push (@scheduledDays, 6) if($optionsService->get('scheduleSaturday'));
  push (@scheduledDays, 7) if($optionsService->get('scheduleSunday'));

  my $runHour = 12;
  my $runMin = 0;
  if ($optionsService->get('scheduleTime') =~ /^(\d+)\:(\d+)$/)
  {
    $runHour = $1;
    $runMin = $2;
  }
  my $runTime = $runHour * 60 * 60 + $runMin * 60; # 12:00
  my ($year, $mon, $mday, $hour, $min, $sec, $yday, $wday, $isdst) = Localtime($time);
#  $year += 1900;
#  $mon++;
#  $wday = $wday || 7; # Sunday
#  die($time . "  $hour:$min");
  my $currentTime = $hour * 60 * 60 + $min * 60 + $sec;
  my $nextDay;

  foreach my $day (@scheduledDays)
  {
    if(($wday == $day) and ($runTime > $currentTime))
    {
      # Today later
      return Mktime( $year, $mon, $mday, $runHour, $runMin, 0 );
    }
    if(!$nextDay && ($day > $wday) )
    {
      $nextDay = $day;
    }
  }

  # Day later this week
  if($nextDay)
  {
    my ($nYear, $nMonth, $nDay) = Add_Delta_Days($year, $mon, $mday, $nextDay - $wday);
    return Mktime( $nYear, $nMonth, $nDay, $runHour, $runMin, 0);
  }

  # Day on next week
  my ($nYear, $nMonth, $nDay) = Add_Delta_Days($year, $mon, $mday, 7 - $wday + $scheduledDays[0]);
  return Mktime( $nYear, $nMonth, $nDay, $runHour, $runMin, 0);

}

sub calcNextGames
{
  my ($self, $count) = @_;
  $count = $count || 1;
  my $nextGames;
  my $game = time - 1;
  for(my $i = 1; $i <= $count; $i++)
  {
    $game = $self->calcNextGameRunTime($game + 1);
    my ($year, $mon, $mday, $hour, $min, $sec, $yday, $wday, $isdst) = Localtime($game);
    push(@{$nextGames}, sprintf("%04d-%02d-%02d %02d:%02d", $year,$mon,$mday,$hour,$min));
  }
  return $nextGames;
}

sub findTotalPrize
{
  my ($self) = @_;
  my $sth = $::sql->handle->prepare("SELECT SUM(`prize`) AS prize FROM `budget`");
  my $rv = $sth->execute();
  my $ref = $sth->fetchrow_hashref();
  return $ref->{'prize'};
}

1;
