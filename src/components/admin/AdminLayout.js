import React from 'react';
import {
  Box,
  Flex,
  useColorModeValue,
  Text,
  Heading,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  HStack,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon
} from '@chakra-ui/react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { FiUsers, FiGift, FiHome, FiLogOut, FiShield, FiBox, FiDollarSign, FiPackage, FiSettings, FiChevronDown, FiPercent } from 'react-icons/fi';

const AdminLayout = ({ children, title = '', breadcrumbs = [] }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Tự động tạo breadcrumbs từ đường dẫn nếu không được cung cấp
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const autoBreadcrumbs = pathSegments.map((segment, index) => {
    const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
    const label = segment.charAt(0).toUpperCase() + segment.slice(1);
    return { path, label };
  });

  const displayBreadcrumbs = breadcrumbs.length > 0 ? breadcrumbs : autoBreadcrumbs;

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      {/* Top Navigation Bar */}
      <Flex 
        as="header" 
        bg={bgColor} 
        color={useColorModeValue('gray.600', 'white')} 
        minH={'60px'} 
        py={{ base: 2 }} 
        px={{ base: 4 }} 
        borderBottom={1} 
        borderStyle={'solid'} 
        borderColor={borderColor} 
        align={'center'} 
        position="sticky"
        top="0"
        zIndex="1"
        shadow="sm"
      >
        <Flex flex={{ base: 1 }} justify={{ base: 'start', md: 'start' }}>
          <Heading
            as="h1"
            size="lg"
            fontWeight="bold"
            color={useColorModeValue('gray.800', 'white')}
          >
            Admin
          </Heading>
        </Flex>

        {/* Desktop Menu - Hiển thị trên mobile */}
        <HStack spacing={4} display={{ base: 'flex', md: 'none' }}>
          <Button 
            variant="ghost"
            leftIcon={<Icon as={FiHome} />}
            onClick={() => navigate('/admin')}
            color={location.pathname === '/admin' ? 'blue.500' : ''}
          >
            Dashboard
          </Button>
          
          <Button 
            variant="ghost"
            leftIcon={<Icon as={FiShield} />}
            onClick={() => navigate('/admin/management')}
            color={location.pathname === '/admin/management' ? 'blue.500' : ''}
          >
            Quản lý
          </Button>
          
          <Button 
            variant="ghost"
            leftIcon={<Icon as={FiUsers} />}
            onClick={() => navigate('/admin/users')}
            color={location.pathname === '/admin/users' ? 'blue.500' : ''}
          >
            Người dùng
          </Button>
          
          <Button 
            variant="ghost"
            leftIcon={<Icon as={FiGift} />}
            onClick={() => navigate('/admin/boxes')}
            color={location.pathname === '/admin/boxes' ? 'blue.500' : ''}
          >
            Hộp quà
          </Button>
          
          <Button 
            variant="ghost"
            leftIcon={<Icon as={FiLogOut} />}
            onClick={() => navigate('/logout')}
          >
            Đăng xuất
          </Button>
        </HStack>
        
        {/* Mobile Menu - Hiển thị trên desktop */}
        <Box display={{ base: 'none', md: 'flex' }}>
          <Menu>
            <MenuButton as={Button} variant="ghost">
              Menu
            </MenuButton>
            <MenuList>
              <MenuItem icon={<Icon as={FiHome} />} onClick={() => navigate('/admin')}>
                Dashboard
              </MenuItem>
              <MenuItem icon={<Icon as={FiShield} />} onClick={() => navigate('/admin/management')}>
                Quản lý
              </MenuItem>
              <MenuItem icon={<Icon as={FiUsers} />} onClick={() => navigate('/admin/users')}>
                Người dùng
              </MenuItem>
              <MenuItem icon={<Icon as={FiPercent} />} onClick={() => navigate('/admin/box-type-chance-management')}>
                Quản lý tỷ lệ mở Quà
              </MenuItem>
              <MenuItem icon={<Icon as={FiGift} />} onClick={() => navigate('/admin/boxes')}>
                Hộp quà
              </MenuItem>
              <MenuItem icon={<Icon as={FiPackage} />} onClick={() => navigate('/admin/items')}>
                Vật phẩm
              </MenuItem>
              <MenuItem icon={<Icon as={FiBox} />} onClick={() => navigate('/admin/box-history')}>
                Lịch sử mở hộp
              </MenuItem>
              <MenuItem icon={<Icon as={FiDollarSign} />} onClick={() => navigate('/admin/transactions')}>
                Giao dịch
              </MenuItem>
              <MenuItem icon={<Icon as={FiSettings} />} onClick={() => navigate('/admin/settings')}>
                Cài đặt
              </MenuItem>
              <MenuItem icon={<Icon as={FiLogOut} />} onClick={() => navigate('/logout')}>
                Đăng xuất
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Flex>

      {/* Main content - now full width */}
      <Box w="full" p="6">
        {/*         <Box mb={6}>
          <Heading as="h1" size="xl" mb={2}>
            {title || (pathSegments.length > 0 ? pathSegments[pathSegments.length - 1].charAt(0).toUpperCase() + pathSegments[pathSegments.length - 1].slice(1) : 'Dashboard')}
          </Heading>
          
          <Breadcrumb spacing="8px" separator="/">
            <BreadcrumbItem>
              <BreadcrumbLink as={Link} to="/admin">Admin</BreadcrumbLink>
            </BreadcrumbItem>
            
            {displayBreadcrumbs.map((crumb, index) => (
              <BreadcrumbItem key={index} isCurrentPage={index === displayBreadcrumbs.length - 1}>
                {index === displayBreadcrumbs.length - 1 ? (
                  <Text>{crumb.label}</Text>
                ) : (
                  <BreadcrumbLink as={Link} to={crumb.path}>{crumb.label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            ))}
          </Breadcrumb>
        </Box>
*/}

        {/* Page content */}
        <Box>{children}</Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;