package Data::User;
use strict;

# Пользователь
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

sub getId 
{
    my ($self) = @_;
    return $self->{'id'};
}

sub setId 
{
    my ($self, $id) = @_;
    $self->{'id'} = $id;
}

sub getAsfnId
{
    my ($self) = @_;
    return $self->{'asfn_id'};
}

sub setAsfnId
{
    my ($self, $asfnId) = @_;
    $self->{'asfn_id'} = $asfnId;
}

sub getName
{
    my ($self) = @_;
    return $self->{'name'};
}

sub setName
{
    my ($self, $name) = @_;
    $self->{'name'} = $name;
}

sub getEmail
{
    my ($self) = @_;
    return $self->{'email'};
}

sub setEmail
{
    my ($self, $email) = @_;
    $self->{'email'} = $email;
}

sub getCountry
{
    my ($self) = @_;
    return $self->{'country'};
}

sub setCountry
{
    my ($self, $country) = @_;
    $self->{'country'} = $country;
}

sub getCity
{
    my ($self) = @_;
    return $self->{'city'};
}

sub setCity
{
    my ($self, $city) = @_;
    $self->{'city'} = $city;
}


1;