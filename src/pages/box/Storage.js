import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Spinner,
  Text,
  useToast,
} from '@chakra-ui/react';
import storageApi from '../../api/storageApi';

const Storage = () => {
  const [rewards, setRewards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user')); // Lấy thông tin người dùng từ localStorage
        if (!user) {
          toast({
            title: 'Lỗi',
            description: 'Bạn cần đăng nhập để xem vật phẩm.',
            status: 'warning',
            duration: 3000,
            isClosable: true,
          });
          setIsLoading(false);
          return;
        }
        const data = await storageApi.getUserRewards(user.username); // Gọi API lấy vật phẩm
        setRewards(data.data);
      } catch (error) {
        toast({
          title: 'Lỗi',
          description: error.message || 'Không thể tải danh sách vật phẩm.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRewards();
  }, [toast]);

  if (isLoading) {
    return (
      <Box textAlign="center" mt={10}>
        <Spinner size="xl" />
        <Text mt={4}>Đang tải danh sách vật phẩm...</Text>
      </Box>
    );
  }

  if (rewards.length === 0) {
    return (
      <Box textAlign="center" mt={10}>
        <Text fontSize="lg" color="gray.500">
          Bạn không sở hữu vật phẩm nào.
        </Text>
      </Box>
    );
  }

  return (
    <Box maxW="800px" mx="auto" mt={10} p={6}>
      <Heading size="lg" mb={6} textAlign="center">
        Vật phẩm của bạn
      </Heading>
      <Table variant="striped" colorScheme="teal">
        <Thead>
          <Tr>
            <Th>Mã</Th>
            <Th>Tên</Th>
            <Th>Độ hiếm</Th>
            <Th>Loại</Th>
            <Th>Giá trị</Th>
            <Th>Mô tả</Th>
          </Tr>
        </Thead>
        <Tbody>
          {rewards.map((reward) => (
            <Tr key={reward._id}>
              <Td>{reward.id}</Td>
              <Td>{reward.label}</Td>
              <Td>
                <Badge
                  colorScheme={
                    reward.rarity === 'common'
                      ? 'gray'
                      : reward.rarity === 'rare'
                      ? 'blue'
                      : reward.rarity === 'epic'
                      ? 'purple'
                      : reward.rarity === 'legendary'
                      ? 'yellow'
                      : 'green'
                  }
                >
                  {reward.rarity}
                </Badge>
              </Td>
              <Td>{reward.type}</Td>
              <Td>{reward.value}</Td>
              <Td>{reward.description || 'Không có mô tả'}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default Storage;