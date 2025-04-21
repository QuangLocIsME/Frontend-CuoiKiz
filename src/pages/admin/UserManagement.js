import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Stack,
  Text,
  HStack,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { FiSearch, FiMoreVertical, FiEdit, FiTrash2, FiUserX, FiPlus, FiAlertTriangle, FiRefreshCw, FiDollarSign } from 'react-icons/fi';
import AdminLayout from '../../components/admin/AdminLayout';
import userApi from '../../api/userApi';

// Modal chỉnh sửa người dùng
const EditUserModal = ({ isOpen, onClose, user, onSave }) => {
  const [userData, setUserData] = useState({
    fullname: '',
    email: '',
    username: '',
    phoneNumber: ''
  });

  useEffect(() => {
    if (user) {
      setUserData({
        fullname: user.fullname || '',
        email: user.email || '',
        username: user.username || '',
        phoneNumber: user.phoneNumber || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(userData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Chỉnh sửa thông tin người dùng</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Họ tên</FormLabel>
              <Input name="fullname" value={userData.fullname} onChange={handleChange} />
            </FormControl>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input name="email" type="email" value={userData.email} onChange={handleChange} />
            </FormControl>
            <FormControl>
              <FormLabel>Tên đăng nhập</FormLabel>
              <Input name="username" value={userData.username} onChange={handleChange} />
            </FormControl>
            <FormControl>
              <FormLabel>Số điện thoại</FormLabel>
              <Input name="phoneNumber" value={userData.phoneNumber} onChange={handleChange} />
            </FormControl>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Hủy
          </Button>
          <Button colorScheme="blue" onClick={handleSubmit}>
            Lưu thay đổi
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

// Modal đặt lại mật khẩu
const ResetPasswordModal = ({ isOpen, onClose, userId, onReset }) => {
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = () => {
    onReset(userId, newPassword);
    setNewPassword('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Đặt lại mật khẩu</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Mật khẩu mới</FormLabel>
            <Input 
              type="password" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Hủy
          </Button>
          <Button 
            colorScheme="blue" 
            onClick={handleSubmit}
            isDisabled={newPassword.length < 6}
          >
            Đặt lại mật khẩu
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

// Modal nạp tiền/xu
const AddBalanceModal = ({ isOpen, onClose, userId, onAddBalance }) => {
  const [amount, setAmount] = useState(10000);
  const [type, setType] = useState('money');

  const handleSubmit = () => {
    onAddBalance(userId, amount, type);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Nạp tiền/xu vào tài khoản</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Loại nạp</FormLabel>
              <Select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="money">Tiền (VNĐ)</option>
                <option value="coins">Xu</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Số lượng</FormLabel>
              <NumberInput min={1} value={amount} onChange={(valueString) => setAmount(Number(valueString))}>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Hủy
          </Button>
          <Button colorScheme="blue" onClick={handleSubmit}>
            Nạp
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

// Trang quản lý người dùng
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userId, setUserId] = useState(null);
  
  const toast = useToast();
  
  // Các state cho modal
  const { 
    isOpen: isEditModalOpen, 
    onOpen: onEditModalOpen, 
    onClose: onEditModalClose 
  } = useDisclosure();
  
  const { 
    isOpen: isResetPasswordModalOpen, 
    onOpen: onResetPasswordModalOpen, 
    onClose: onResetPasswordModalClose 
  } = useDisclosure();
  
  const { 
    isOpen: isAddBalanceModalOpen, 
    onOpen: onAddBalanceModalOpen, 
    onClose: onAddBalanceModalClose 
  } = useDisclosure();
  
  // Dialog xác nhận xóa
  const { 
    isOpen: isDeleteAlertOpen, 
    onOpen: onDeleteAlertOpen, 
    onClose: onDeleteAlertClose 
  } = useDisclosure();
  const cancelRef = React.useRef();

  // Tải danh sách người dùng
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await userApi.getAllUsers();
      if (response.success) {
        setUsers(response.data);
        setFilteredUsers(response.data);
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách người dùng',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Lọc người dùng theo từ khóa tìm kiếm
  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(user => 
        user.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  // Xử lý chỉnh sửa thông tin người dùng
  const handleEditUser = (user) => {
    setSelectedUser(user);
    onEditModalOpen();
  };

  const handleSaveUser = async (userData) => {
    try {
      const response = await userApi.updateUserByAdmin(selectedUser._id, userData);
      if (response.success) {
        toast({
          title: 'Thành công',
          description: 'Cập nhật thông tin người dùng thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchUsers();
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error.response?.data?.message || 'Không thể cập nhật thông tin người dùng',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Xử lý đặt lại mật khẩu
  const handleResetPassword = (id) => {
    setUserId(id);
    onResetPasswordModalOpen();
  };

  const handlePasswordReset = async (userId, newPassword) => {
    try {
      const response = await userApi.resetPassword(userId, newPassword);
      if (response.success) {
        toast({
          title: 'Thành công',
          description: 'Đặt lại mật khẩu thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error.response?.data?.message || 'Không thể đặt lại mật khẩu',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Xử lý chuyển đổi trạng thái người dùng
  const handleToggleStatus = async (userId) => {
    try {
      const response = await userApi.toggleUserStatus(userId);
      if (response.success) {
        toast({
          title: 'Thành công',
          description: response.message,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchUsers();
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error.response?.data?.message || 'Không thể thay đổi trạng thái người dùng',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Xử lý nạp tiền/xu
  const handleAddBalance = (id) => {
    setUserId(id);
    onAddBalanceModalOpen();
  };

  const handleAddBalanceSubmit = async (userId, amount, type) => {
    try {
      const response = await userApi.addBalance(userId, amount, type);
      if (response.success) {
        toast({
          title: 'Thành công',
          description: response.message,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchUsers();
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error.response?.data?.message || 'Không thể nạp tiền/xu',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Xử lý xóa người dùng
  const handleDeleteUser = (id) => {
    setUserId(id);
    onDeleteAlertOpen();
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await userApi.deleteUser(userId);
      if (response.success) {
        toast({
          title: 'Thành công',
          description: 'Xóa người dùng thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchUsers();
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error.response?.data?.message || 'Không thể xóa người dùng',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      onDeleteAlertClose();
    }
  };

  return (
    <AdminLayout title="Quản lý người dùng">
      <Box mb={6}>
        <Flex justify="space-between" mb={5}>
          <InputGroup maxW="300px">
            <InputLeftElement pointerEvents="none">
              <FiSearch color="gray.300" />
            </InputLeftElement>
            <Input 
              placeholder="Tìm kiếm người dùng..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>

          <HStack>
            <Button 
              leftIcon={<FiRefreshCw />} 
              onClick={fetchUsers}
              isLoading={isLoading}
            >
              Làm mới
            </Button>
          </HStack>
        </Flex>

        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Họ tên</Th>
                <Th>Tên đăng nhập</Th>
                <Th>Email</Th>
                <Th>Số dư (VNĐ)</Th>
                <Th>Xu</Th>
                <Th>Trạng thái</Th>
                <Th>Thao tác</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredUsers.map((user) => (
                <Tr key={user._id}>
                  <Td>{user.fullname}</Td>
                  <Td>{user.username}</Td>
                  <Td>{user.email}</Td>
                  <Td>{user.balance?.toLocaleString()} VNĐ</Td>
                  <Td>{user.coins}</Td>
                  <Td>
                    <Badge colorScheme={user.isActive ? 'green' : 'red'}>
                      {user.isActive ? 'Hoạt động' : 'Vô hiệu'}
                    </Badge>
                  </Td>
                  <Td>
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        aria-label="Options"
                        icon={<FiMoreVertical />}
                        variant="ghost"
                        size="sm"
                      />
                      <MenuList>
                        <MenuItem 
                          icon={<FiEdit />} 
                          onClick={() => handleEditUser(user)}
                        >
                          Chỉnh sửa
                        </MenuItem>
                        <MenuItem 
                          icon={<FiRefreshCw />} 
                          onClick={() => handleResetPassword(user._id)}
                        >
                          Đặt lại mật khẩu
                        </MenuItem>
                        <MenuItem 
                          icon={<FiDollarSign />} 
                          onClick={() => handleAddBalance(user._id)}
                        >
                          Nạp tiền/xu
                        </MenuItem>
                        <MenuItem 
                          icon={<FiUserX />} 
                          onClick={() => handleToggleStatus(user._id)}
                        >
                          {user.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}
                        </MenuItem>
                        {user.role !== 'admin' && (
                          <MenuItem 
                            icon={<FiTrash2 />} 
                            onClick={() => handleDeleteUser(user._id)}
                            color="red.500"
                          >
                            Xóa tài khoản
                          </MenuItem>
                        )}
                      </MenuList>
                    </Menu>
                  </Td>
                </Tr>
              ))}
              {filteredUsers.length === 0 && !isLoading && (
                <Tr>
                  <Td colSpan={7} textAlign="center" py={4}>
                    <Text>Không tìm thấy người dùng nào</Text>
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>

      {/* Modal chỉnh sửa người dùng */}
      <EditUserModal 
        isOpen={isEditModalOpen} 
        onClose={onEditModalClose} 
        user={selectedUser}
        onSave={handleSaveUser}
      />

      {/* Modal đặt lại mật khẩu */}
      <ResetPasswordModal 
        isOpen={isResetPasswordModalOpen} 
        onClose={onResetPasswordModalClose} 
        userId={userId}
        onReset={handlePasswordReset}
      />

      {/* Modal nạp tiền/xu */}
      <AddBalanceModal 
        isOpen={isAddBalanceModalOpen} 
        onClose={onAddBalanceModalClose} 
        userId={userId}
        onAddBalance={handleAddBalanceSubmit}
      />

      {/* Dialog xác nhận xóa người dùng */}
      <AlertDialog
        isOpen={isDeleteAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteAlertClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Xóa người dùng
            </AlertDialogHeader>

            <AlertDialogBody>
              <HStack>
                <Icon as={FiAlertTriangle} color="red.500" />
                <Text>
                  Bạn có chắc chắn muốn xóa người dùng này? Tất cả dữ liệu liên quan đến người dùng này sẽ bị xóa vĩnh viễn.
                </Text>
              </HStack>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteAlertClose}>
                Hủy
              </Button>
              <Button colorScheme="red" onClick={handleConfirmDelete} ml={3}>
                Xóa
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </AdminLayout>
  );
};

export default UserManagement; 