import React, { useState, useEffect, lazy, Suspense } from 'react';
import {
  Box,
  Flex,
  Text,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Icon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  useColorModeValue,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  useDisclosure
} from '@chakra-ui/react';
import { FaUsers, FaCoins, FaChartBar, FaCog, FaUserShield, FaGift, FaEdit, FaTrash, FaKey, FaMoneyBillWave, FaLock, FaUnlock } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

// Lazy load các thành phần con
const UserManagementPanel = lazy(() => import('./UserManagement'));
const BoxManagementPanel = lazy(() => import('./BoxManagement'));

const AdminManagement = () => {
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    userCount: 0,
    activeUsers: 0,
    totalRevenue: 0,
    totalTransactions: 0,
    boxCount: 0,
    activeBoxes: 0
  });
  
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
      
      try {
        const token = localStorage.getItem('accessToken');
        console.log('Đang lấy thống kê với token:', token);
        
        const headers = {
          'Authorization': `Bearer ${token}`
        };
        
        // Gọi API lấy thống kê người dùng
        const userStatsResponse = await axios.get(
          'https://intuitive-surprise-production.up.railway.app/api/users/stats',
          { headers }
        );
        
        console.log('Phản hồi API thống kê người dùng:', userStatsResponse.data);
        
        // Gọi API lấy thống kê hộp quà
        const boxStatsResponse = await axios.get(
          'https://intuitive-surprise-production.up.railway.app/api/boxes/stats',
          { headers }
        );
        
        console.log('Phản hồi API thống kê hộp quà:', boxStatsResponse.data);
        
        // Cập nhật state với dữ liệu từ API
        setStats({
          userCount: userStatsResponse.data.data?.userCount || 0,
          activeUsers: userStatsResponse.data.data?.activeUsers || 0,
          totalRevenue: userStatsResponse.data.data?.totalRevenue || 15000000, // Giá trị mặc định nếu không có dữ liệu
          totalTransactions: userStatsResponse.data.data?.totalTransactions || 450, // Giá trị mặc định
          boxCount: boxStatsResponse.data.data?.boxCount || 0,
          activeBoxes: boxStatsResponse.data.data?.activeBoxes || 0
        });
        
        // Debug log chi tiết cấu trúc dữ liệu nhận được
        console.log('Cấu trúc dữ liệu từ userStatsResponse:', userStatsResponse.data);
        console.log('Cấu trúc dữ liệu từ boxStatsResponse:', boxStatsResponse.data);
        
      } catch (error) {
        console.error('Lỗi khi lấy thống kê:', error);
        console.error('Chi tiết lỗi:', error.response || 'Không có phản hồi');
        
        setStats({
          userCount: 120,
          activeUsers: 95,
          totalRevenue: 15000000,
          totalTransactions: 450,
          boxCount: 30,
          activeBoxes: 25
        });
        
        // Thông báo lỗi cho người dùng (nếu cần)
        toast.error('Không thể lấy dữ liệu thống kê. Đang hiển thị dữ liệu mẫu.');
      } finally {
        setLoading(false);
      }
    };

    // Chỉ fetch dữ liệu nếu người dùng là admin
    if (user && user.role === 'admin') {
      fetchStatistics();
    } else {
      setLoading(false);
    }
  }, [user, toast]);

  // Kiểm tra nếu người dùng không phải admin thì chuyển hướng
  console.log('User trong AdminManagement:', user);
  
  // Kiểm tra localStorage
  const localUser = localStorage.getItem('user');
  console.log('User từ localStorage:', localUser ? JSON.parse(localUser) : null);
  
  // Kiểm tra isAdmin
  const adminStatus = isAdmin();
  console.log('isAdmin() result:', adminStatus);
  
  // Kiểm tra cookies
  console.log('Document cookies:', document.cookie);
  
  if (!user) {
    return (
      <Box p={8} textAlign="center">
        <Heading size="lg" mb={4}>Đang tải thông tin người dùng...</Heading>
        <Text mb={4}>Vui lòng đợi trong giây lát.</Text>
        {localUser && (
          <Box p={4} borderWidth="1px" borderRadius="md" mb={4}>
            <Heading size="md" mb={2}>Debug: Thông tin từ localStorage</Heading>
            <Text whiteSpace="pre-wrap">{localUser}</Text>
            <Button mt={4} colorScheme="blue" onClick={() => window.location.reload()}>
              Tải lại trang
            </Button>
          </Box>
        )}
      </Box>
    );
  }
  
  if (user && user.role !== 'admin') {
    return (
      <Box p={8} textAlign="center">
        <Heading size="lg" mb={4}>Quyền truy cập bị từ chối</Heading>
        <Text mb={4}>Bạn không có quyền truy cập trang này.</Text>
        <Box p={4} borderWidth="1px" borderRadius="md">
          <Heading size="md" mb={2}>Debug: Thông tin người dùng</Heading>
          <Text>Username: {user.username}</Text>
          <Text>Role: {user.role}</Text>
          <Button mt={4} colorScheme="blue" onClick={() => window.location.reload()}>
            Tải lại trang
          </Button>
        </Box>
      </Box>
    );
  }

  return (
      <Box>
        <Flex mb={5} alignItems="center">
          <Icon as={FaUserShield} mr={2} boxSize={6} />
          <Heading size="lg">Trung tâm quản lý</Heading>
        </Flex>
        
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
          {/* Thống kê tổng quan */}
          <Stat bg={bgColor} p={4} borderRadius="md" borderWidth="1px" borderColor={borderColor} shadow="sm">
            <Flex alignItems="center">
              <Icon as={FaUsers} mr={4} boxSize={6} color="blue.500" />
              <Box>
                <StatLabel>Tổng người dùng</StatLabel>
                <StatNumber>{stats.userCount}</StatNumber>
                <StatHelpText>{stats.activeUsers} người dùng đang hoạt động</StatHelpText>
              </Box>
            </Flex>
          </Stat>
          
          <Stat bg={bgColor} p={4} borderRadius="md" borderWidth="1px" borderColor={borderColor} shadow="sm">
            <Flex alignItems="center">
              <Icon as={FaCoins} mr={4} boxSize={6} color="yellow.500" />
              <Box>
                <StatLabel>Tổng doanh thu</StatLabel>
                <StatNumber>{stats.totalRevenue.toLocaleString('vi-VN')} đ</StatNumber>
                <StatHelpText>Từ {stats.totalTransactions} giao dịch</StatHelpText>
              </Box>
            </Flex>
          </Stat>
          
          <Stat bg={bgColor} p={4} borderRadius="md" borderWidth="1px" borderColor={borderColor} shadow="sm">
            <Flex alignItems="center">
              <Icon as={FaChartBar} mr={4} boxSize={6} color="green.500" />
              <Box>
                <StatLabel>Lượt chơi hôm nay</StatLabel>
                <StatNumber>84</StatNumber>
                <StatHelpText>Tăng 12% so với hôm qua</StatHelpText>
              </Box>
            </Flex>
          </Stat>
          
          <Stat bg={bgColor} p={4} borderRadius="md" borderWidth="1px" borderColor={borderColor} shadow="sm">
            <Flex alignItems="center">
              <Icon as={FaGift} mr={4} boxSize={6} color="purple.500" />
              <Box>
                <StatLabel>Hộp quà hiện có</StatLabel>
                <StatNumber>{stats.boxCount}</StatNumber>
                <StatHelpText>{stats.activeBoxes} hộp quà đang kích hoạt</StatHelpText>
              </Box>
            </Flex>
          </Stat>
        </SimpleGrid>
        
        {/* Tabs cho các chức năng khác nhau */}
        <Box bg={bgColor} p={5} borderRadius="md" borderWidth="1px" borderColor={borderColor} shadow="md">
          <Suspense fallback={
            <Box textAlign="center" p={10}>
              <Text>Đang tải dữ liệu...</Text>
            </Box>
          }>
            <UserManagementPanel />
          </Suspense>
        </Box>
      </Box>
  );
};

export default AdminManagement; 