package Data::Game;
use strict;

# Розыгрыш


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

    return $self;
}

sub get {
  my ($self, $attr) = @_;
  return $self->{$attr};
}   

sub getId {
    my ($self) = shift;
    return $self->{'id'};
}
sub setId {
    my ($self, $id) = @_;
    $self->{'id'} = $id;
}

sub getLuckyNumbers {
    my ($self) = shift;
    return $self->{'lucky_numbers'};
}

sub getDate {
    my ($self) = shift;
    return $self->{'date'};
}

sub getTotalSum {
    my ($self) = shift;
    return $self->{'total_sum'};
}

sub getMaxNumber {
    my ($self) = shift;
    return $self->{'max_number'};
}

sub getCountNumbers {
    my ($self) = shift;
    return $self->{'count_numbers'};
}

1;