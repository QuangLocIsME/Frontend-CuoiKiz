import React from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Image, Text, Heading, Stack, Badge, Button, Divider, VStack } from '@chakra-ui/react';
import boxApi from '../../api/boxApi';
import moment from 'moment'; // Import moment để định dạng ngày giờ

const Detail = () => {
  const { state: box } = useLocation(); // Lấy dữ liệu box từ state

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
          <Button colorScheme="teal" size="md">
            Quay ngay
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Detail;