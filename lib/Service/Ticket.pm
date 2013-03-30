package Service::Ticket;
use strict;

# Игровые сессии
my $table = "tickets";

sub new
{
    my $proto = shift;                 # извлекаем имя класса или указатель на объект
    my $class = ref($proto) || $proto; # если указатель, то взять из него имя класса
    my $self  = {};
    # Приём данных из new(param=>value)
    my %params = @_;
    foreach (keys %params){
        $self->{$_} = $params{$_};
    }
    bless($self, $class);              # гибкий вызов функции bless

    return $self;
}

sub findById
{
  my ($self, $id) = @_;
  my $sth = $::sql->handle->prepare("SELECT * FROM `$table` WHERE `id`= ?");
  my $rv = $sth->execute($id);
  return undef if($rv == 0E0);
  my $ref = $sth->fetchrow_hashref();
  my $ticket = new Data::Ticket(%$ref);
  return $ticket;
}

sub findAll
{
    my ($self) = @_;
    my $sth = $::sql->handle->prepare("SELECT * FROM `$table`");
    my $rv = $sth->execute();
    return () if($rv == 0E0);
    my @tickets;
    while(my $ref = $sth->fetchrow_hashref())
    {
      push(@tickets, new Data::Ticket(%$ref));
    }
    return @tickets;
}

sub findBySessionId
{
    my ($self, $sessionId) = @_;
    my $sth = $::sql->handle->prepare("SELECT * FROM `$table` WHERE `session_id`= ?");
    my $rv = $sth->execute($sessionId);
    return () if($rv == 0E0);
    my @tickets;
    while(my $ref = $sth->fetchrow_hashref())
    {
      push(@tickets, new Data::Ticket(%$ref));
    }
    return @tickets;
}

sub findActive
{
    my ($self) = @_;
    my $sth = $::sql->handle->prepare("SELECT `$table`.* FROM `$table` JOIN `game_sessions` ON `game_sessions`.`id` = `$table`.`session_id` WHERE `games_left` > 0 AND `game_sessions`.`paid` IS NOT NULL");
    my $rv = $sth->execute();
    return () if($rv == 0E0);
    my @tickets;
    while(my $ref = $sth->fetchrow_hashref())
    {
      push(@tickets, new Data::Ticket(%$ref));
    }
    return @tickets;
}

sub save
{
    my ($self, $ticket) = @_;
    if(!$ticket->getId())
    {
        my $sth = $::sql->handle->prepare("INSERT INTO `$table` (`session_id`, `numbers`, `games`, `games_left`) VALUES (?, ?, ?, ?)");
        $sth->execute($ticket->getSessionId(), $ticket->getNumbers(), $ticket->getGames(), $ticket->getGames());
        $ticket->setId($::sql->handle->{'mysql_insertid'});
    }
    else
    {
        my $sth = $::sql->handle->prepare("UPDATE `$table` SET `games_left` = ? WHERE `id` = ?");
        $sth->execute($ticket->getGamesLeft(), $ticket->getId());
    }
}

sub validate
{
    my ($self, $ticket, $maxNumber, $countNumbers) = @_;
    my @numbers = split(',', $ticket->getNumbers());
    if(scalar @numbers != $countNumbers)
    {
      return "Выбрано неправильное количество номеров.";
    }
    foreach my $num(@numbers)
    {
      if(($num < 1) or ($num > $maxNumber))
      {
        return "Билет содержит некорректное число.";
      }
    }
}

sub delete
{
    my ($self, $ticketId) = @_;
    my $sth = $::sql->handle->prepare("DELETE FROM `$table` WHERE `id` = ? ");
    $sth->execute($ticketId);
}

sub calcGuessed
{
  my ($self, $ticket, @luckyNumbers) = @_;
  my @ticketNumbers = split(',', $ticket->getNumbers());
  my $guessed = 0;
  foreach my $ticketNumber(@ticketNumbers)
  {
    foreach my $winNum (@luckyNumbers)
    {
      if($ticketNumber == $winNum)
      {
        $guessed++;
        last;
      }
    }
  }
  return $guessed;
}

1;