import AuthDAO from './AuthDAO';
import CommandesDAO from './CommandesDAO';
import ParkingsDAO from './ParkingsDAO';
import UserDAO from './UserDAO';

const Daos = {
  Auth: new AuthDAO(),
  Parkings: new ParkingsDAO(),
  Commandes: new CommandesDAO(),
  User: new UserDAO()
};

export default Daos;
