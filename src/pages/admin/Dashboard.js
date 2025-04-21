import React, { useState, useEffect } from 'react';
import { 
  Box, 
  SimpleGrid, 
  Stat, 
  StatLabel, 
  StatNumber, 
  StatHelpText, 
  Heading, 
  Text, 
  Flex, 
  Icon, 
  Divider,
  Card,
  CardBody,
  CardHeader,
  TableContainer, 
  Table, 
  Thead, 
  Tr, 
  Th, 
  Tbody, 
  Td,
  Badge,
  useColorModeValue,
  Skeleton
} from '@chakra-ui/react';
import { FiUsers, FiBox, FiDollarSign, FiPackage } from 'react-icons/fi';
import AdminLayout from '../../components/admin/AdminLayout';
import userApi from '../../api/userApi';
import boxApi from '../../api/boxApi';

const StatCard = ({ title, value, icon, helpText, isLoading, change }) => {
  return (
    <Card boxShadow="sm" borderRadius="lg">
      <CardBody>
        <Flex justifyContent="space-between" alignItems="center">
          <Box>
            <StatLabel fontSize="sm" color="gray.500">{title}</StatLabel>
            {isLoading ? (
              <Skeleton height="36px" width="100px" my={2} />
            ) : (
              <StatNumber fontSize="2xl" fontWeight="bold">{value}</StatNumber>
            )}
            {helpText && (
              <StatHelpText fontSize="xs">
                {change && (
                  <Text as="span" color={change > 0 ? 'green.500' : 'red.500'}>
                    {change > 0 ? '↑' : '↓'} {Math.abs(change)}%{' '}
                  </Text>
                )}
                {helpText}
              </StatHelpText>
            )}
          </Box>
          <Icon 
            as={icon} 
            boxSize={12} 
            color={useColorModeValue('blue.500', 'blue.300')} 
            opacity={0.8} 
            padding={2}
            borderRadius="md"
            bg={useColorModeValue('blue.50', 'blue.900')}
          />
        </Flex>
      </CardBody>
    </Card>
  );
};

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [boxes, setBoxes] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalBoxes: 0,
    activeBoxes: 0,
    totalRevenue: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Lấy danh sách người dùng
        const usersResponse = await userApi.getAllUsers();
        if (usersResponse.success) {
          setUsers(usersResponse.data.slice(0, 5)); // Lấy 5 người dùng mới nhất
          
          // Tính toán thống kê người dùng
          const activeUsers = usersResponse.data.filter(user => user.isActive).length;
          
          setStats(prev => ({
            ...prev,
            totalUsers: usersResponse.data.length,
            activeUsers
          }));
        }

        // Lấy danh sách hộp quà
        const boxesResponse = await boxApi.getAllBoxes();
        if (boxesResponse.success) {
          setBoxes(boxesResponse.data.slice(0, 5)); // Lấy 5 hộp quà mới nhất
          
          // Tính toán thống kê hộp quà
          const activeBoxes = boxesResponse.data.filter(box => box.isActive).length;
          
          setStats(prev => ({
            ...prev,
            totalBoxes: boxesResponse.data.length,
            activeBoxes
          }));
        }

        // Thống kê doanh thu và các số liệu khác có thể được thêm ở đây

      } catch (err) {
        console.error('Lỗi khi tải dữ liệu cho dashboard:', err);
        setError('Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <AdminLayout title="Trang chủ quản trị">
      <Box mb={8}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={5} mb={8}>
          <StatCard 
            title="Tổng số người dùng" 
            value={stats.totalUsers} 
            icon={FiUsers} 
            helpText="Tổng số tài khoản"
            isLoading={isLoading} 
          />
          <StatCard 
            title="Người dùng đang hoạt động" 
            value={stats.activeUsers} 
            icon={FiUsers} 
            helpText={`${((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}% tài khoản`}
            isLoading={isLoading} 
          />
          <StatCard 
            title="Tổng số hộp quà" 
            value={stats.totalBoxes} 
            icon={FiBox} 
            helpText="Hộp quà đang có"
            isLoading={isLoading} 
          />
          <StatCard 
            title="Hộp quà đang hoạt động" 
            value={stats.activeBoxes} 
            icon={FiGift} 
            helpText={`${((stats.activeBoxes / stats.totalBoxes) * 100).toFixed(1)}% hộp quà`}
            isLoading={isLoading} 
          />
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={5}>
          {/* Danh sách người dùng mới nhất */}
          <Card boxShadow="sm" borderRadius="lg">
            <CardHeader pb={0}>
              <Heading size="md">Người dùng mới nhất</Heading>
            </CardHeader>
            <CardBody>
              <TableContainer>
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr>
                      <Th>Tên đầy đủ</Th>
                      <Th>Email</Th>
                      <Th>Trạng thái</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {isLoading ? (
                      Array(5).fill(0).map((_, index) => (
                        <Tr key={index}>
                          <Td><Skeleton height="20px" /></Td>
                          <Td><Skeleton height="20px" /></Td>
                          <Td><Skeleton height="20px" width="80px" /></Td>
                        </Tr>
                      ))
                    ) : (
                      users.map(user => (
                        <Tr key={user._id}>
                          <Td>{user.fullname}</Td>
                          <Td>{user.email}</Td>
                          <Td>
                            <Badge colorScheme={user.isActive ? 'green' : 'red'}>
                              {user.isActive ? 'Hoạt động' : 'Vô hiệu'}
                            </Badge>
                          </Td>
                        </Tr>
                      ))
                    )}
                  </Tbody>
                </Table>
              </TableContainer>
            </CardBody>
          </Card>

          {/* Danh sách hộp quà mới nhất */}
          <Card boxShadow="sm" borderRadius="lg">
            <CardHeader pb={0}>
              <Heading size="md">Hộp quà gần đây</Heading>
            </CardHeader>
            <CardBody>
              <TableContainer>
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr>
                      <Th>Mã</Th>
                      <Th>Tên hộp quà</Th>
                      <Th>Loại</Th>
                      <Th>Trạng thái</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {isLoading ? (
                      Array(5).fill(0).map((_, index) => (
                        <Tr key={index}>
                          <Td><Skeleton height="20px" width="80px" /></Td>
                          <Td><Skeleton height="20px" /></Td>
                          <Td><Skeleton height="20px" width="60px" /></Td>
                          <Td><Skeleton height="20px" width="80px" /></Td>
                        </Tr>
                      ))
                    ) : (
                      boxes.map(box => (
                        <Tr key={box._id}>
                          <Td>{box.boxId}</Td>
                          <Td>{box.name}</Td>
                          <Td>
                            <Badge colorScheme="blue">{box.boxType}</Badge>
                          </Td>
                          <Td>
                            <Badge colorScheme={box.isActive ? 'green' : 'red'}>
                              {box.isActive ? 'Hoạt động' : 'Ẩn'}
                            </Badge>
                          </Td>
                        </Tr>
                      ))
                    )}
                  </Tbody>
                </Table>
              </TableContainer>
            </CardBody>
          </Card>
        </SimpleGrid>
      </Box>
    </AdminLayout>
  );
};

export default AdminDashboard; 