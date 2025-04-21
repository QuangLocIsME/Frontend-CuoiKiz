import React, { useState, useEffect, useRef } from 'react';
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
  Textarea,
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
  Image,
  FormHelperText,
  FormErrorMessage,
} from '@chakra-ui/react';
import { FiSearch, FiMoreVertical, FiEdit, FiTrash2, FiEye, FiPlus, FiAlertTriangle, FiRefreshCw, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import AdminLayout from '../../components/admin/AdminLayout';
import boxApi from '../../api/boxApi';

// Modal thêm/sửa hộp quà
const BoxFormModal = ({ isOpen, onClose, boxData, onSave, isEditing = false }) => {
  const initialRef = useRef();
  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    description: '',
    price: 10000,
    coinPrice: 10,
    boxType: 'STD',
    image: '',
    isActive: true
  });
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (isEditing && boxData) {
      setFormData({
        name: boxData.name || '',
        shortDescription: boxData.shortDescription || '',
        description: boxData.description || '',
        price: boxData.price || 10000,
        coinPrice: boxData.coinPrice || 10,
        boxType: boxData.boxType || 'STD',
        image: boxData.image || '',
        isActive: boxData.isActive !== undefined ? boxData.isActive : true
      });
    } else {
      // Reset form khi tạo mới
      setFormData({
        name: '',
        shortDescription: '',
        description: '',
        price: 10000,
        coinPrice: 10,
        boxType: 'STD',
        image: '',
        isActive: true
      });
    }
  }, [isEditing, boxData, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNumberChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: Number(value)
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB
        toast({
          title: 'Lỗi',
          description: 'Kích thước file vượt quá 5MB',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Lỗi',
          description: 'Vui lòng chọn file hình ảnh',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      setImage(file);
      setFormData(prev => ({
        ...prev,
        image: file.name
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Tên hộp quà không được để trống';
    if (!formData.shortDescription) newErrors.shortDescription = 'Mô tả ngắn không được để trống';
    if (formData.shortDescription && formData.shortDescription.length > 100) 
      newErrors.shortDescription = 'Mô tả ngắn không được vượt quá 100 ký tự';
    if (!formData.description) newErrors.description = 'Mô tả chi tiết không được để trống';
    if (formData.price < 0) newErrors.price = 'Giá tiền không được âm';
    if (formData.coinPrice < 0) newErrors.coinPrice = 'Giá xu không được âm';
    if (!isEditing && !image) newErrors.image = 'Vui lòng chọn hình ảnh cho hộp quà';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Upload image nếu có
      if (image) {
        const formData = new FormData();
        formData.append('image', image);
        const uploadResponse = await boxApi.uploadBoxImage(formData);
        if (uploadResponse.success) {
          setFormData(prev => ({ ...prev, image: uploadResponse.fileName }));
        } else {
          toast({
            title: 'Lỗi',
            description: 'Không thể tải lên hình ảnh',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          setIsSubmitting(false);
          return;
        }
      }

      // Lưu thông tin hộp quà
      await onSave(formData);
      onClose();
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Đã xảy ra lỗi khi lưu hộp quà',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      initialFocusRef={initialRef}
      size="xl"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isEditing ? 'Chỉnh sửa hộp quà' : 'Thêm hộp quà mới'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <FormControl isRequired isInvalid={!!errors.name}>
              <FormLabel>Tên hộp quà</FormLabel>
              <Input 
                ref={initialRef}
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="Nhập tên hộp quà"
              />
              {errors.name && <FormErrorMessage>{errors.name}</FormErrorMessage>}
            </FormControl>

            {!isEditing && (
              <FormControl isRequired isInvalid={!!errors.boxType}>
                <FormLabel>Loại hộp quà</FormLabel>
                <Select name="boxType" value={formData.boxType} onChange={handleChange}>
                  <option value="LOVA">Giá trị thấp (LOVA)</option>
                  <option value="MEDI">Giá trị trung bình (MEDI)</option>
                  <option value="HIGV">Giá trị cao (HIGV)</option>
                  <option value="EVNT">Sự kiện đặc biệt (EVNT)</option>
                  <option value="RAND">Ngẫu nhiên (RAND)</option>
                </Select>
                <FormHelperText>Loại hộp quà không thể thay đổi sau khi tạo</FormHelperText>
              </FormControl>
            )}

            <FormControl isRequired isInvalid={!!errors.shortDescription}>
              <FormLabel>Mô tả ngắn</FormLabel>
              <Input 
                name="shortDescription" 
                value={formData.shortDescription} 
                onChange={handleChange}
                placeholder="Nhập mô tả ngắn (tối đa 100 ký tự)"
                maxLength={100}
              />
              {errors.shortDescription && <FormErrorMessage>{errors.shortDescription}</FormErrorMessage>}
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.description}>
              <FormLabel>Mô tả chi tiết</FormLabel>
              <Textarea 
                name="description" 
                value={formData.description} 
                onChange={handleChange}
                placeholder="Nhập mô tả chi tiết về hộp quà"
                rows={4}
              />
              {errors.description && <FormErrorMessage>{errors.description}</FormErrorMessage>}
            </FormControl>

            <HStack spacing={4}>
              <FormControl isRequired isInvalid={!!errors.price}>
                <FormLabel>Giá tiền (VNĐ)</FormLabel>
                <NumberInput 
                  min={0} 
                  value={formData.price} 
                  onChange={(value) => handleNumberChange('price', value)}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                {errors.price && <FormErrorMessage>{errors.price}</FormErrorMessage>}
              </FormControl>

              <FormControl isRequired isInvalid={!!errors.coinPrice}>
                <FormLabel>Giá xu</FormLabel>
                <NumberInput 
                  min={0} 
                  value={formData.coinPrice} 
                  onChange={(value) => handleNumberChange('coinPrice', value)}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                {errors.coinPrice && <FormErrorMessage>{errors.coinPrice}</FormErrorMessage>}
              </FormControl>
            </HStack>

            <FormControl isRequired isInvalid={!!errors.image}>
              <FormLabel>Hình ảnh</FormLabel>
              {isEditing && formData.image && (
                <Box mb={2}>
                  <Text fontSize="sm" mb={1}>Hình ảnh hiện tại:</Text>
                  <Image 
                    src={`http://localhost:5000${formData.image}`} 
                    alt={formData.name}
                    maxH="100px"
                    objectFit="cover"
                    borderRadius="md"
                  />
                </Box>
              )}
              <Input 
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
                p={1}
              />
              <FormHelperText>
                {isEditing ? 'Chọn hình ảnh mới để thay đổi (không bắt buộc)' : 'Chọn hình ảnh cho hộp quà (tối đa 5MB)'}
              </FormHelperText>
              {errors.image && <FormErrorMessage>{errors.image}</FormErrorMessage>}
            </FormControl>

            <FormControl>
              <FormLabel>Trạng thái</FormLabel>
              <Select name="isActive" value={formData.isActive.toString()} onChange={handleChange}>
                <option value="true">Hoạt động (Hiển thị)</option>
                <option value="false">Ẩn (Không hiển thị)</option>
              </Select>
            </FormControl>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Hủy
          </Button>
          <Button 
            colorScheme="blue" 
            onClick={handleSubmit}
            isLoading={isSubmitting}
          >
            {isEditing ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

// Trang quản lý hộp quà
const BoxManagement = () => {
  const [boxes, setBoxes] = useState([]);
  const [filteredBoxes, setFilteredBoxes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBox, setSelectedBox] = useState(null);
  const [boxId, setBoxId] = useState(null);
  
  const toast = useToast();
  const cancelRef = useRef();
  
  // Xử lý mở/đóng modal
  const { 
    isOpen: isFormModalOpen, 
    onOpen: onFormModalOpen, 
    onClose: onFormModalClose 
  } = useDisclosure();
  
  const { 
    isOpen: isDeleteAlertOpen, 
    onOpen: onDeleteAlertOpen, 
    onClose: onDeleteAlertClose 
  } = useDisclosure();

  // State lưu trạng thái đang thêm mới hay chỉnh sửa
  const [isEditing, setIsEditing] = useState(false);
  
  // Tải danh sách hộp quà
  const fetchBoxes = async () => {
    setIsLoading(true);
    try {
      const response = await boxApi.getAllBoxes();
      if (response.success) {
        setBoxes(response.data);
        setFilteredBoxes(response.data);
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách hộp quà',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBoxes();
  }, []);

  // Lọc hộp quà theo từ khóa tìm kiếm
  useEffect(() => {
    if (searchTerm) {
      const filtered = boxes.filter(box => 
        box.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        box.boxId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        box.boxType?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBoxes(filtered);
    } else {
      setFilteredBoxes(boxes);
    }
  }, [searchTerm, boxes]);

  // Xử lý mở modal thêm mới
  const handleAddBox = () => {
    setIsEditing(false);
    setSelectedBox(null);
    onFormModalOpen();
  };

  // Xử lý mở modal chỉnh sửa
  const handleEditBox = (box) => {
    setIsEditing(true);
    setSelectedBox(box);
    onFormModalOpen();
  };

  // Xử lý lưu hộp quà (thêm mới/chỉnh sửa)
  const handleSaveBox = async (boxData) => {
    try {
      let response;
      
      if (isEditing) {
        // Cập nhật hộp quà
        response = await boxApi.updateBox(selectedBox.boxId, boxData);
        if (response.success) {
          toast({
            title: 'Thành công',
            description: 'Cập nhật hộp quà thành công',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
        }
      } else {
        // Thêm mới hộp quà
        response = await boxApi.createBox(boxData);
        if (response.success) {
          toast({
            title: 'Thành công',
            description: 'Tạo hộp quà mới thành công',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
        }
      }
      
      fetchBoxes();
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error.response?.data?.message || 'Đã xảy ra lỗi khi lưu hộp quà',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      throw error;
    }
  };

  // Xử lý chuyển đổi trạng thái hộp quà
  const handleToggleStatus = async (boxId) => {
    try {
      const response = await boxApi.toggleBoxStatus(boxId);
      if (response.success) {
        toast({
          title: 'Thành công',
          description: response.message,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchBoxes();
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error.response?.data?.message || 'Không thể thay đổi trạng thái hộp quà',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Xử lý xóa hộp quà
  const handleDeleteBox = (id) => {
    setBoxId(id);
    onDeleteAlertOpen();
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await boxApi.deleteBox(boxId);
      if (response.success) {
        toast({
          title: 'Thành công',
          description: 'Xóa hộp quà thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchBoxes();
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error.response?.data?.message || 'Không thể xóa hộp quà',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      onDeleteAlertClose();
    }
  };

  // Render badge cho loại hộp quà
  const renderBoxTypeBadge = (boxType) => {
    let color;
    switch (boxType) {
      case 'LOVA':
        color = 'green';
        break;
      case 'MEDI':
        color = 'blue';
        break;
      case 'HIGV':
        color = 'purple';
        break;
      case 'EVNT':
        color = 'orange';
        break;
      case 'RAND':
        color = 'pink';
        break;
      default:
        color = 'gray';
    }
    return <Badge colorScheme={color}>{boxType}</Badge>;
  };

  return (
    <AdminLayout title="Quản lý hộp quà">
      <Box mb={6}>
        <Flex justify="space-between" mb={5}>
          <InputGroup maxW="300px">
            <InputLeftElement pointerEvents="none">
              <FiSearch color="gray.300" />
            </InputLeftElement>
            <Input 
              placeholder="Tìm kiếm hộp quà..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>

          <HStack>
            <Button 
              leftIcon={<FiRefreshCw />} 
              onClick={fetchBoxes}
              isLoading={isLoading}
            >
              Làm mới
            </Button>
            <Button 
              leftIcon={<FiPlus />} 
              colorScheme="blue"
              onClick={handleAddBox}
            >
              Thêm hộp quà
            </Button>
          </HStack>
        </Flex>

        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Mã hộp quà</Th>
                <Th>Tên</Th>
                <Th>Loại</Th>
                <Th>Giá tiền (VNĐ)</Th>
                <Th>Giá xu</Th>
                <Th>Trạng thái</Th>
                <Th>Thao tác</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredBoxes.map((box) => (
                <Tr key={box._id}>
                  <Td>{box.boxId}</Td>
                  <Td>{box.name}</Td>
                  <Td>{renderBoxTypeBadge(box.boxType)}</Td>
                  <Td>{box.price?.toLocaleString()} VNĐ</Td>
                  <Td>{box.coinPrice} xu</Td>
                  <Td>
                    <Badge colorScheme={box.isActive ? 'green' : 'red'}>
                      {box.isActive ? 'Hoạt động' : 'Ẩn'}
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
                          icon={<FiEye />} 
                          onClick={() => window.open(`http://localhost:5000${box.image}`, '_blank')}
                        >
                          Xem hình ảnh
                        </MenuItem>
                        <MenuItem 
                          icon={<FiEdit />} 
                          onClick={() => handleEditBox(box)}
                        >
                          Chỉnh sửa
                        </MenuItem>
                        <MenuItem 
                          icon={box.isActive ? <FiToggleRight /> : <FiToggleLeft />} 
                          onClick={() => handleToggleStatus(box.boxId)}
                        >
                          {box.isActive ? 'Ẩn hộp quà' : 'Hiển thị hộp quà'}
                        </MenuItem>
                        <MenuItem 
                          icon={<FiTrash2 />} 
                          onClick={() => handleDeleteBox(box.boxId)}
                          color="red.500"
                        >
                          Xóa hộp quà
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Td>
                </Tr>
              ))}
              {filteredBoxes.length === 0 && !isLoading && (
                <Tr>
                  <Td colSpan={7} textAlign="center" py={4}>
                    <Text>Không tìm thấy hộp quà nào</Text>
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>

      {/* Modal thêm/sửa hộp quà */}
      <BoxFormModal 
        isOpen={isFormModalOpen} 
        onClose={onFormModalClose} 
        boxData={selectedBox}
        onSave={handleSaveBox}
        isEditing={isEditing}
      />

      {/* Dialog xác nhận xóa hộp quà */}
      <AlertDialog
        isOpen={isDeleteAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteAlertClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Xóa hộp quà
            </AlertDialogHeader>

            <AlertDialogBody>
              <HStack>
                <Icon as={FiAlertTriangle} color="red.500" />
                <Text>
                  Bạn có chắc chắn muốn xóa hộp quà này? Hành động này không thể hoàn tác.
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

export default BoxManagement; 