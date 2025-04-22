import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Input,
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  HStack,
  useToast,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Select,
  Textarea,
} from '@chakra-ui/react';
import { FiEdit, FiTrash2, FiPlus, FiMoreVertical } from 'react-icons/fi';
import rewardApi from '../../api/rewardApi';
import { format } from 'date-fns'; // Thư viện để định dạng ngày giờ

const RewardManagement = () => {
  const [rewards, setRewards] = useState([]);
  const [selectedReward, setSelectedReward] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    label: '',
    rarity: 'common',
    type: 'product',
    value: 0,
    description: '',
    assetByUser: '', // Thêm trường assetByUser
  });
  const toast = useToast();

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      const data = await rewardApi.getAllRewards();
      setRewards(data.data);
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách phần thưởng',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleOpenModal = (reward = null) => {
    setSelectedReward(reward);
    setFormData(
      reward || {
        id: '',
        label: '',
        rarity: 'common',
        type: 'product',
        value: 0,
        description: '',
        assetByUser: '', // Gán giá trị mặc định cho assetByUser
      }
    );
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReward(null);
  };

  const handleSaveReward = async () => {
    try {
      if (selectedReward) {
        // Update reward
        await rewardApi.updateReward(selectedReward.id, formData);
        toast({
          title: 'Thành công',
          description: 'Cập nhật phần thưởng thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        // Create reward
        await rewardApi.createReward(formData);
        toast({
          title: 'Thành công',
          description: 'Tạo phần thưởng thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      fetchRewards();
      handleCloseModal();
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error.response?.data?.message || 'Không thể lưu phần thưởng',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteReward = async (id) => {
    try {
      await rewardApi.deleteReward(id);
      toast({
        title: 'Thành công',
        description: 'Xóa phần thưởng thành công',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchRewards();
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error.response?.data?.message || 'Không thể xóa phần thưởng',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="auto" mx="auto" mt={10} p={6}>
      <Flex justify="space-between" mb={6}>
        <Button leftIcon={<FiPlus />} colorScheme="blue" onClick={() => handleOpenModal()}>
          Thêm phần thưởng
        </Button>
      </Flex>

      <TableContainer>
        <Table variant="striped">
          <Thead>
            <Tr>
              <Th>Mã</Th>
              <Th>Tên</Th>
              <Th>Độ hiếm</Th>
              <Th>Loại</Th>
              <Th>Giá trị</Th>
              <Th>Mô tả</Th>
              <Th>Thuộc về user</Th>
              <Th>Ngày tạo</Th>
              <Th>Cập nhật cuối</Th>
              <Th>Thao tác</Th>
            </Tr>
          </Thead>
          <Tbody>
            {rewards.map((reward) => (
              <Tr key={reward.id}>
                <Td>{reward.id}</Td>
                <Td>{reward.label}</Td>
                <Td>
                  <Badge colorScheme={reward.rarity === 'common' ? 'gray' : reward.rarity === 'rare' ? 'blue' : 'purple'}>
                    {reward.rarity}
                  </Badge>
                </Td>
                <Td>{reward.type}</Td>
                <Td>{reward.value}</Td>
                <Td>{reward.description}</Td>
                <Td>{reward.assetByUser || 'N/A'}</Td> {/* Hiển thị assetByUser */}
                <Td>{format(new Date(reward.createdAt), 'dd/MM/yyyy HH:mm')}</Td>
                <Td>{format(new Date(reward.updatedAt), 'dd/MM/yyyy HH:mm')}</Td>
                <Td>
                  <Menu>
                    <MenuButton as={IconButton} icon={<FiMoreVertical />} variant="ghost" />
                    <MenuList>
                      <MenuItem icon={<FiEdit />} onClick={() => handleOpenModal(reward)}>
                        Chỉnh sửa
                      </MenuItem>
                      <MenuItem icon={<FiTrash2 />} color="red.500" onClick={() => handleDeleteReward(reward.id)}>
                        Xóa
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Modal thêm/sửa phần thưởng */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedReward ? 'Chỉnh sửa phần thưởng' : 'Thêm phần thưởng'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Mã</FormLabel>
              <Input
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                isDisabled={!!selectedReward}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Tên</FormLabel>
              <Input
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Độ hiếm</FormLabel>
              <Select
                value={formData.rarity}
                onChange={(e) => setFormData({ ...formData, rarity: e.target.value })}
              >
                <option value="common">Common</option>
                <option value="uncommon">Uncommon</option>
                <option value="rare">Rare</option>
                <option value="epic">Epic</option>
                <option value="legendary">Legendary</option>
                <option value="event">Event</option>
              </Select>
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Loại</FormLabel>
              <Select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="discount">Discount</option>
                <option value="product">Product</option>
                <option value="special">Special</option>
                <option value="event">Event</option>
              </Select>
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Giá trị</FormLabel>
              <Input
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Mô tả</FormLabel>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Thuộc về user</FormLabel>
              <Input
                value={formData.assetByUser}
                onChange={(e) => setFormData({ ...formData, assetByUser: e.target.value })}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleCloseModal} mr={3}>
              Hủy
            </Button>
            <Button colorScheme="blue" onClick={handleSaveReward}>
              Lưu
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default RewardManagement;