package Service::Budget;
use strict;

# Бюджет
my $table = "budget";

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
    my $obj = new Data::Budget(%$ref);
    return $obj;
}

sub findAll
{
    my ($self) = @_;
    my $sth = $::sql->handle->prepare("SELECT * FROM `$table` ORDER BY `game_id`");
    my $rv = $sth->execute();
    return () if($rv == 0E0);
    my @objects;
    while(my $ref = $sth->fetchrow_hashref())
    {
      push(@objects, new Data::Budget(%$ref));
    }
    return @objects;
}

sub findLast
{
    my ($self, $id) = @_;
    my $sth = $::sql->handle->prepare("SELECT * FROM `$table` ORDER BY `game_id` DESC LIMIT 1");
    my $rv = $sth->execute();
    return undef if($rv == 0E0);
    my $ref = $sth->fetchrow_hashref();
    my $obj = new Data::Budget(%$ref);
    return $obj;
}

sub save
{
    my ($self, $budget) = @_;
    if($budget->getGameId())
    {
      my $sth = $::sql->handle->prepare("UPDATE `budget` SET `sum` = ?, `prize` = ?, `costs` = ?, `marketing` = ?, `support` = ?, `profit` = ? WHERE `game_id` = ?");
      $sth->execute($budget->getSum(), $budget->getPrize(), $budget->getCosts(), $budget->getMarketing(), $budget->getSupport(), $budget->getProfit(), $budget->getGameId());
    }
    else
    {
    }
}

sub recalcLastBudget
{
    my ($self, $optionsService) = @_;
    my $budget = $self->findLast();
    my $sum = $budget->getSum();
    my $prize = $sum * $optionsService->get('budgetPrize') / 100;
    my $costs = $sum * $optionsService->get('budgetCosts') / 100;
    my $marketing = $sum * $optionsService->get('budgetMarketing') / 100;
    my $support = $sum * $optionsService->get('budgetSupport') / 100;
    my $profit = $sum * $optionsService->get('budgetProfit') / 100;

    $budget->setPrize($prize);
    $budget->setCosts($costs);
    $budget->setMarketing($marketing);
    $budget->setSupport($support);
    $budget->setProfit($profit);

    $self->save($budget);
}

1;