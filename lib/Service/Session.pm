package Service::Session;
use strict;

# Игровые сессии
my $table = "game_sessions";

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

sub findById
{
    my ($self, $id) = @_;
    my $sth = $::sql->handle->prepare("SELECT * FROM `$table` WHERE `id`= ? ");
    my $rv = $sth->execute($id);
    return undef if($rv == 0E0);
    my $ref = $sth->fetchrow_hashref();
    my $session = new Data::Session(%$ref);
    return $session;
}

sub findAll
{
    my ($self) = @_;
    my $sth = $::sql->handle->prepare("SELECT * FROM `$table` ORDER BY `created`");
    my $rv = $sth->execute();
    return () if($rv == 0E0);
    my @sessions;
    while(my $ref = $sth->fetchrow_hashref())
    {
      push(@sessions, new Data::Session(%$ref));
    }
    return @sessions;
}

sub findByCgiSessionId
{
    my ($self, $cgiSession) = @_;
    my $sth = $::sql->handle->prepare("SELECT * FROM `$table` WHERE `cgi_session`= ? ");
    my $rv = $sth->execute($cgiSession);
    return undef if($rv == 0E0);
    my $ref = $sth->fetchrow_hashref();
    my $session = new Data::Session(%$ref);
    return $session;
}

sub save
{
    my ($self, $session) = @_;
    if($session->getId())
    {
        my $sth = $::sql->handle->prepare("UPDATE `$table` SET `user_id` = ? WHERE `id`= ?");
        $sth->execute($session->getUserId(), $session->getId());
        
    }
    else
    {
        my $key = Sirius::Common::GenerateRandomString(16);
        my $sth = $::sql->handle->prepare("INSERT INTO `$table` (`cgi_session`, `game_price`, `key`, `created`) VALUES (?, ?, ?, NOW())");
        $sth->execute($session->getCgiSession(), $session->getGamePrice(), $key);
        $session->setId($::sql->handle->{'mysql_insertid'});
    }
}

sub pay
{
    my ($self, $session) = @_;
    if(!$session->getPaid() && $session->getId())
    {
        my $sth = $::sql->handle->prepare("UPDATE `$table` SET `paid` = NOW() WHERE `id`= ?");
        $sth->execute($session->getId());
    }
}

sub validate
{
  my ($self, $session) = @_;
  return undef;
}

1;