import s from './Navbar.module.css';
import { NavLink } from 'react-router-dom';

const Navbar = (props) => {
   return (
      <nav className={s.topMenu}>
         <ul>
            <li>
               <NavLink to="finance">Finance</NavLink>
            </li>
            <li>
               <NavLink to="ping">Ping</NavLink>
            </li>
         </ul>
      </nav>
   )
}

export default Navbar;