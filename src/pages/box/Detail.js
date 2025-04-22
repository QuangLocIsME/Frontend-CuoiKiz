import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Image,
  Text,
  Heading,
  Stack,
  Badge,
  Button,
  Divider,
  VStack,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from '@chakra-ui/react';
import boxApi from '../../api/boxApi';
import buyApi from '../../api/buyApi';
import moment from 'moment'; // Import moment để định dạng ngày giờ

const Detail = () => {
  const { state: box } = useLocation(); // Lấy dữ liệu box từ state
  const [isCongratsOpen, setIsCongratsOpen] = useState(false); // Trạng thái mở lớp phủ chúc mừng
  const [congratsMessage, setCongratsMessage] = useState(''); // Thông báo chúc mừng
  const toast = useToast();

  if (!box) {
    return (
      <Box p={5} textAlign="center">
        <Text fontSize="lg" color="red.500">
          Không tìm thấy thông tin box.
        </Text>
      </Box>
    );
  }

  const imageUrl = boxApi.getImageUrl(box.image); // Lấy URL hình ảnh từ API
  const discountedPrice = box.discount > 0
    ? Math.round((box.price || 0) * (1 - (box.discount || 0) / 100))
    : box.price || 0;

  const discountedCoinPrice = box.discount > 0
    ? Math.round((box.coinPrice || 0) * (1 - (box.discount || 0) / 100))
    : box.coinPrice || 0;

  const handleBuy = async (type) => {
    try {
      const user = JSON.parse(localStorage.getItem('user')); // Lấy thông tin người dùng từ localStorage
      if (!user) {
        toast({
          title: 'Lỗi',
          description: 'Bạn cần đăng nhập để thực hiện giao dịch này.',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      const username = user.username; // Lấy tên người dùng từ thông tin người dùng
      const response = await buyApi.buyItem(box.boxId, username, type); // Gọi API mua

      // Hiển thị thông tin quan trọng từ phản hồi API
      const { reward, userBalance, userCoins } = response.data;

      setCongratsMessage(`
        🎉 Chúc mừng bạn đã trúng phần thưởng:
        - Tên: ${reward.label}
        - Độ hiếm: ${reward.rarity}
        - Loại: ${reward.type}
        - Giá trị: ${reward.value}
        - Mô tả: ${reward.description || 'Không có mô tả'}
        
        💰 Số dư hiện tại:
        - Tiền: ${userBalance.toLocaleString()} VND
        - Xu: ${userCoins.toLocaleString()} Coin
      `);
      setIsCongratsOpen(true); // Mở lớp phủ chúc mừng
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error.response?.data?.message || 'Không thể mua vật phẩm',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={5} maxW="800px" mx="auto">
      <Stack spacing={5}>
        {/* Hình ảnh */}
        <Image
          src={imageUrl}
          alt={box.name || 'Hộp quà'}
          borderRadius="md"
          objectFit="cover"
          maxH="300px"
          mx="auto"
        />

        {/* Tên và loại box */}
        <Heading textAlign="center">{box.name || 'Không có tên'}</Heading>
        <Badge colorScheme="blue" alignSelf="center">
          {box.boxType || 'Không xác định'}
        </Badge>

        {/* Mô tả */}
        <Text fontSize="lg" color="gray.600" textAlign="justify">
          {box.description || 'Không có mô tả'}
        </Text>

        <Divider />

        {/* Giá và giảm giá */}
        <VStack spacing={2} align="start">
          {box.discount > 0 ? (
            <>
              <Text fontSize="md" color="gray.500" textDecoration="line-through">
                Giá gốc: {(box.price || 0).toLocaleString()} VND
              </Text>
              <Text fontSize="md" color="gray.500" textDecoration="line-through">
                Giá Coin gốc: {(box.coinPrice || 0).toLocaleString()} Coin
              </Text>
              <Text fontWeight="bold" fontSize="xl" color="teal.500">
                Giá sau giảm: {discountedPrice.toLocaleString()} VND
              </Text>
              <Text fontWeight="bold" fontSize="xl" color="teal.500">
                Giá Coin sau giảm: {discountedCoinPrice.toLocaleString()} Coin
              </Text>
              <Text fontSize="md" color="yellow.500">
                Giảm giá: {box.discount || 0}%
              </Text>
            </>
          ) : (
            <>
              <Text fontWeight="bold" fontSize="xl" color="gray.700">
                Giá: {box.price.toLocaleString()} VND
              </Text>
              <Text fontWeight="bold" fontSize="xl" color="gray.700">
                Giá Coin: {box.coinPrice.toLocaleString()} Coin
              </Text>
            </>
          )}
        </VStack>

        <Divider />

        {/* Thông tin thời gian */}
        <VStack spacing={2} align="start">
          <Text fontSize="sm" color="gray.500">
            Ngày tạo: {moment(box.createdAt).format('DD/MM/YYYY HH:mm:ss') || 'Không xác định'}
          </Text>
          <Text fontSize="sm" color="gray.500">
            Cập nhật lần cuối: {moment(box.updatedAt).format('DD/MM/YYYY HH:mm:ss') || 'Không xác định'}
          </Text>
        </VStack>

        <Divider />

        {/* Nút hành động */}
        <Stack direction="row" align="center" justify="space-between">
          <Button colorScheme="teal" size="md" onClick={() => handleBuy('vnd')}>
            Mua bằng VND
          </Button>
          <Button colorScheme="orange" size="md" onClick={() => handleBuy('coin')}>
            Mua bằng Coin
          </Button>
        </Stack>
      </Stack>

      {/* Lớp phủ chúc mừng */}
      <Modal isOpen={isCongratsOpen} onClose={() => setIsCongratsOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Chúc mừng!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize="lg" fontWeight="bold" textAlign="center">
              {congratsMessage}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={() => setIsCongratsOpen(false)}>
              Đóng
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Detail;