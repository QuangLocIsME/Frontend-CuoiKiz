import React from 'react';
import { 
  Box, 
  Flex, 
  Text, 
  Stack, 
  VStack,
  Link, 
  Icon,
  IconButton,
  Divider,
  Heading,
  useColorModeValue
} from '@chakra-ui/react';
import { 
  FiUsers, 
  FiGift, 
  FiSettings, 
  FiHome, 
  FiLogOut, 
  FiMenu,
  FiBox,
  FiDollarSign,
  FiPackage,
  FiShield
} from 'react-icons/fi';
import { Link as RouterLink } from 'react-router-dom';

const NavItem = ({ icon, children, path, ...rest }) => {
  const activeColor = useColorModeValue('blue.500', 'blue.200');
  const inactiveColor = useColorModeValue('gray.600', 'gray.400');
  const bgActiveColor = useColorModeValue('blue.50', 'blue.900');
  const isActive = window.location.pathname === path;

  return (
    <Link
      as={RouterLink}
      to={path}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        bg={isActive ? bgActiveColor : 'transparent'}
        color={isActive ? activeColor : inactiveColor}
        _hover={{
          bg: bgActiveColor,
          color: activeColor,
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

const Sidebar = ({ onClose, ...rest }) => {
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Heading as="h3" size="md" fontWeight="bold">Admin Dashboard</Heading>
      </Flex>

      <VStack spacing={1} align="stretch">
        <Box>
          <Text ml="8" my="4" color="gray.500" fontSize="sm">
            TRANG QUẢN LÝ
          </Text>
          <NavItem icon={FiHome} path="/admin">
            Trang chủ quản trị
          </NavItem>
          <NavItem icon={FiUsers} path="/admin/users">
            Quản lý người dùng
          </NavItem>
          <NavItem icon={FiGift} path="/admin/boxes">
            Quản lý hộp quà
          </NavItem>
          <NavItem icon={FiPackage} path="/admin/items">
            Quản lý vật phẩm
          </NavItem>
        </Box>

        <Divider my={2} />

        <Box>
          <Text ml="8" my="4" color="gray.500" fontSize="sm">
            GIAO DỊCH
          </Text>
          <NavItem icon={FiBox} path="/admin/box-history">
            Lịch sử mở hộp
          </NavItem>
          <NavItem icon={FiDollarSign} path="/admin/transactions">
            Giao dịch nạp tiền
          </NavItem>
        </Box>

        <Divider my={2} />

        <Box>
          <Text ml="8" my="4" color="gray.500" fontSize="sm">
            HỆ THỐNG
          </Text>
          <NavItem icon={FiSettings} path="/admin/settings">
            Cài đặt hệ thống
          </NavItem>
          <NavItem icon={FiShield} path="/admin/security">
            Bảo mật
          </NavItem>
          <NavItem icon={FiLogOut} path="/logout">
            Đăng xuất
          </NavItem>
        </Box>
      </VStack>
    </Box>
  );
};

export default Sidebar; 