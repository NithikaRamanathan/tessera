import { CgProfile } from 'react-icons/cg';
import { Link } from 'react-router-dom';

import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem, 
    Icon
} from '@chakra-ui/react'


const MenuDrop = () => {

    return (
        <Menu>
            <MenuButton>
                    <Icon as={CgProfile} boxSize={8} color='white' />
              
            </MenuButton>
            <MenuList>
                <MenuItem as={Link} to='/login'>Login</MenuItem>
                <MenuItem as={Link} to='/account'>Account</MenuItem>
                <MenuItem>Placeholder</MenuItem>
            </MenuList>
        </Menu>

    )
}

export default MenuDrop;

