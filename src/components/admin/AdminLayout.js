import React, { useState } from 'react';
import {
  Box,
  Flex,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerContent,
  useColorModeValue,
  Text,
  Heading,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  HStack,
  CloseButton
} from '@chakra-ui/react';
import { FiMenu } from 'react-icons/fi';
import { useLocation, Link } from 'react-router-dom';
import Sidebar from './Sidebar';

const AdminLayout = ({ children, title = '', breadcrumbs = [] }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const location = useLocation();

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
      {/* Mobile nav */}
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} position="absolute" right={2} top={2} />
          <Sidebar onClose={onClose} />
        </DrawerContent>
      </Drawer>

      {/* Sidebar for desktop */}
      <Box display={{ base: 'none', md: 'block' }}>
        <Sidebar />
      </Box>

      {/* Main content */}
      <Box ml={{ base: 0, md: 60 }} p="4">
        {/* Mobile header */}
        <Flex
          as="header"
          alignItems="center"
          justifyContent="space-between"
          w="full"
          px="4"
          h="20"
          display={{ base: 'flex', md: 'none' }}
        >
          <IconButton
            display={{ base: 'flex', md: 'none' }}
            onClick={onOpen}
            variant="outline"
            aria-label="open menu"
            icon={<FiMenu />}
          />
          <Heading size="lg" fontWeight="bold">Admin</Heading>
        </Flex>

        {/* Title and breadcrumb */}
        <Box mb={6}>
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

        {/* Page content */}
        <Box>{children}</Box>
      </Box>
    </Box>
  );
};

export default AdminLayout; 