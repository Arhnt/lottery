package Data::Session;
use strict;

# Игровые сессии


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

sub getUserId {
    my ($self) = shift;
    return $self->{'user_id'};
}

sub setUserId {
    my ($self, $userId) = @_;
    $self->{'user_id'} = $userId;
}

sub getCgiSession {
    my ($self) = shift;
    return $self->{'cgi_session'};
}

sub getPaid {
    my ($self) = shift;
    return $self->{'paid'};
}

sub getGamePrice {
    my ($self) = shift;
    return $self->{'game_price'};
}

sub getKey {
    my ($self) = shift;
    return $self->{'key'};
}


1;