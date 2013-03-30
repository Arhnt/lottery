package Data::Budget;
use strict;

# Бюджет
sub new {
    my $proto = shift;                 # извлекаем имя класса или указатель на объект
    my $class = ref($proto) || $proto; # если указатель, то взять из него имя класса
    my $self  = {};
    # Приём данных из new(param=>value)
    my %params = @_;
    foreach (keys %params){
        $self->{$_} = $params{$_};
    }
    bless($self, $class);              # гибкий вызов функции bless

    #Инициализация начальных данных
    return $self;
}

sub getGameId
{
    my ($self) = @_;
    return $self->{'game_id'};
}

sub getSum
{
    my ($self) = @_;
    return $self->{'sum'};
}

sub getPrize
{
    my ($self) = @_;
    return $self->{'prize'};
}
sub setPrize
{
    my ($self, $prize) = @_;
    $self->{'prize'} = $prize;
}

sub getCosts
{
    my ($self) = @_;
    return $self->{'costs'};
}
sub setCosts
{
    my ($self, $costs) = @_;
    $self->{'costs'} = $costs;
}

sub getMarketing
{
    my ($self) = @_;
    return $self->{'marketing'};
}
sub setMarketing
{
    my ($self, $marketing) = @_;
    $self->{'marketing'} = $marketing;
}

sub getSupport
{
    my ($self) = @_;
    return $self->{'support'};
}
sub setSupport
{
    my ($self, $support) = @_;
    $self->{'support'} = $support;
}

sub getProfit
{
    my ($self) = @_;
    return $self->{'profit'};
}
sub setProfit
{
    my ($self, $profit) = @_;
    $self->{'profit'} = $profit;
}

1;