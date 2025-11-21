import AuthDAO from './AuthDAO';
import CommandesDAO from './CommandesDAO';
import ParkingsDAO from './ParkingsDAO';
import UserDAO from './UserDAO';
import ReviewsDAO from './ReviewsDAO';

const Daos = {
  Auth: new AuthDAO(),
  Parkings: new ParkingsDAO(),
  Commandes: new CommandesDAO(),
  User: new UserDAO(),
  Reviews: new ReviewsDAO()
};

export default Daos;
