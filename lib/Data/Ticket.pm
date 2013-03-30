package Data::Ticket;
use strict;

# Игровые билеты


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

sub getNumbers {
    my ($self) = shift;
    return $self->{'numbers'};
}

sub getSessionId {
    my ($self) = shift;
    return $self->{'session_id'};
}

sub getGames {
    my ($self) = shift;
    return $self->{'games'};
}

sub getGamesLeft {
    my ($self) = shift;
    return $self->{'games_left'};
}

sub setGamesLeft {
    my ($self, $gamesLeft) = @_;
    $self->{'games_left'} = $gamesLeft;
}

1;