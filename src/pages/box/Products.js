import React from 'react';
import { Box, Image, Text, Button, SimpleGrid, VStack } from '@chakra-ui/react';

// Dữ liệu giả lập
const mockBoxes = [
  {
    boxId: "BOX-LOVA-00001",
    name: "Quang Lộc",
    shortDescription: "Quang Lộc",
    description: "Quang Lộc",
    price: 10000,
    coinPrice: 10,
    image: "https://via.placeholder.com/150", // Thay bằng URL ảnh thực tế
    boxType: "LOVA",
    isActive: true,
  },
  {
    boxId: "BOX-LOVA-00002",
    name: "Box 2",
    shortDescription: "Mô tả ngắn Box 2",
    description: "Mô tả chi tiết Box 2",
    price: 20000,
    coinPrice: 20,
    image: "https://via.placeholder.com/150", // Thay bằng URL ảnh thực tế
    boxType: "LOVA",
    isActive: true,
  },
  {
    boxId: "BOX-LOVA-00003",
    name: "Box 3",
    shortDescription: "Mô tả ngắn Box 3",
    description: "Mô tả chi tiết Box 3",
    price: 30000,
    coinPrice: 30,
    image: "https://via.placeholder.com/150", // Thay bằng URL ảnh thực tế
    boxType: "LOVA",
    isActive: true,
  },
];

const Products = () => {
  const handleSpin = (boxId) => {
    alert(`Quay ngay cho Box ID: ${boxId}`);
  };

  return (
    <Box p={5}>
      <Text fontSize="2xl" fontWeight="bold" mb={5}>
        Danh sách Lucky Box
      </Text>
      <SimpleGrid columns={[1, 2, 3]} spacing={5}>
        {mockBoxes.map((box) => (
          <VStack
            key={box.boxId}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            p={4}
            spacing={3}
          >
            <Image src={box.image} alt={box.name} boxSize="150px" objectFit="cover" />
            <Text fontWeight="bold">{box.name}</Text>
            <Text fontSize="sm" color="gray.500">
              {box.shortDescription}
            </Text>
            <Text>Giá: {box.price.toLocaleString()} VND</Text>
            <Text>Giá Coin: {box.coinPrice} Coin</Text>
            <Button colorScheme="teal" onClick={() => handleSpin(box.boxId)}>
              Quay ngay
            </Button>
          </VStack>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default Products;