import React, { useState, useEffect } from 'react';
import { Box, Image, Text, Button, SimpleGrid, VStack, HStack, Spinner } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import boxApi from '../../api/boxApi'; // Import boxApi

const boxTypes = ["ALL", "LOVA", "MEDI", "HIGV", "EVNT", "RAND"];

const Products = () => {
  const [boxes, setBoxes] = useState([]); // State để lưu danh sách box
  const [selectedType, setSelectedType] = useState("ALL"); // Mặc định chọn "ALL"
  const [loading, setLoading] = useState(true); // State để theo dõi trạng thái tải
  const navigate = useNavigate();

  // Gọi API để lấy danh sách box
  useEffect(() => {
    const fetchBoxes = async () => {
      try {
        const data = await boxApi.getAllBoxes(); // Gọi API từ boxApi
        if (data.success) {
          setBoxes(data.data); // Lưu danh sách box vào state
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách box:", error);
      } finally {
        setLoading(false); // Tắt trạng thái tải
      }
    };

    fetchBoxes();
  }, []);

  // Lọc danh sách box theo loại
  const filteredBoxes = selectedType === "ALL"
    ? boxes // Hiển thị tất cả box nếu chọn "ALL"
    : boxes.filter((box) => box.boxType === selectedType);

  const handleViewDetail = (box) => {
    navigate(`/box/${box.boxId}`, { state: box }); // Điều hướng đến trang chi tiết và truyền dữ liệu
  };

  if (loading) {
    return (
      <Box p={5} textAlign="center">
        <Spinner size="xl" />
        <Text mt={3}>Đang tải danh sách box...</Text>
      </Box>
    );
  }

  return (
    <Box p={5}>
      <Text fontSize="2xl" fontWeight="bold" mb={3}>
        Danh sách Lucky Box
      </Text>

      {/* Bộ lọc phân loại */}
      <HStack spacing={3} mb={5}>
        {boxTypes.map((type) => (
          <Button
            key={type}
            colorScheme={selectedType === type ? "teal" : "gray"}
            onClick={() => setSelectedType(type)}
          >
            {type}
          </Button>
        ))}
      </HStack>

      {/* Danh sách box được lọc */}
      <SimpleGrid columns={[1, 2, 3]} spacing={5}>
        {filteredBoxes.map((box, index) => (
          <VStack
            key={box._id || `${box.boxId}-${index}`} // Đảm bảo key là duy nhất
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            p={4}
            spacing={3}
          >
            <Image
              src={boxApi.getImageUrl(box.image)} // Sử dụng hàm getImageUrl từ boxApi để lấy URL hình ảnh
              alt={box.name}
              boxSize="150px"
              objectFit="cover"
            />
            <Text fontWeight="bold">{box.name}</Text>
            <Text fontSize="sm" color="gray.500">
              {box.shortDescription}
            </Text>
            <Text>Giá: {box.price.toLocaleString()} VND</Text>
            <Text>Giá Coin: {box.coinPrice} Coin</Text>
            <Button colorScheme="teal" onClick={() => handleViewDetail(box)}>
              Xem chi tiết
            </Button>
          </VStack>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default Products;