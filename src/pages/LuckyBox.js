import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Text,
  Image,
  Button,
  Flex,
  Badge,
  useColorModeValue,
  Stack,
  Divider,
  Tag,
  IconButton,
} from '@chakra-ui/react';
import { FaShoppingCart, FaStar, FaCoins } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const BoxCard = ({ box }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // Tính giá sau khi giảm giá
  const discountedPrice = box.discount > 0
    ? Math.round(box.price * (1 - box.discount / 100))
    : box.price;
  
  return (
    <Box
      maxW={'320px'}
      w={'full'}
      bg={bgColor}
      boxShadow={'md'}
      rounded={'lg'}
      p={6}
      textAlign={'center'}
      borderWidth="1px"
      borderColor={borderColor}
      position="relative"
      transition="transform 0.3s"
      _hover={{ transform: 'translateY(-5px)', boxShadow: 'lg' }}
    >
      {/* Hiển thị badge giảm giá nếu có */}
      {box.discount > 0 && (
        <Badge
          position="absolute"
          top={3}
          right={3}
          colorScheme="red"
          variant="solid"
          fontSize="md"
          borderRadius="md"
          px={2}
          py={1}
          zIndex={1}
        >
          {box.discount}% OFF
        </Badge>
      )}
      
      <Image
        h={'200px'}
        w={'full'}
        src={`https://intuitive-surprise-production.up.railway.app${box.image}`}
        alt={`Hình ảnh ${box.name}`}
        objectFit="cover"
        borderRadius="md"
        mb={4}
      />
      
      <Heading fontSize={'xl'} fontFamily={'body'} mb={2} color={textColor} isTruncated>
        {box.name}
      </Heading>
      
      <Text fontWeight={600} color={'gray.500'} mb={4} fontSize="sm" noOfLines={2}>
        {box.shortDescription}
      </Text>
      
      <Stack direction={'row'} align={'center'} justify={'center'} mb={4}>
        {box.discount > 0 ? (
          <>
            <Text textDecoration="line-through" color="gray.500" fontSize="sm">
              {box.price.toLocaleString()} VNĐ
            </Text>
            <Text fontWeight={800} fontSize="xl" color="red.500">
              {discountedPrice.toLocaleString()} VNĐ
            </Text>
          </>
        ) : (
          <Text fontWeight={800} fontSize="xl">
            {box.price.toLocaleString()} VNĐ
          </Text>
        )}
      </Stack>
      
      <Divider mb={4} />
      
      <Flex justify="space-between" align="center" wrap="wrap">
        <Tag colorScheme={box.boxType === 'LOVA' ? 'blue' : 
                          box.boxType === 'MEDI' ? 'green' : 
                          box.boxType === 'HIGV' ? 'purple' : 
                          box.boxType === 'EVNT' ? 'orange' : 'teal'}>
          {box.boxType}
        </Tag>
        
        <Flex align="center">
          <Icon as={FaCoins} color="yellow.500" mr={1} />
          <Text fontWeight="bold" fontSize="sm">
            {box.coinPrice} xu
          </Text>
        </Flex>
      </Flex>
      
      <Button
        w={'full'}
        mt={8}
        bg={'blue.400'}
        color={'white'}
        rounded={'md'}
        _hover={{
          transform: 'translateY(-2px)',
          boxShadow: 'lg',
          bg: 'blue.500',
        }}
        leftIcon={<FaShoppingCart />}
      >
        Mua ngay
      </Button>
    </Box>
  );
};

const LuckyBox = () => {
  const [boxes, setBoxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchBoxes = async () => {
      try {
        const response = await axios.get('https://intuitive-surprise-production.up.railway.app/api/boxes');
        if (response.data.success) {
          setBoxes(response.data.data.filter(box => box.isActive));
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách hộp quà:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBoxes();
  }, []);

  return (
    <Container maxW={'7xl'} py={12}>
      <Heading as="h1" mb={8} textAlign="center">
        Hộp quà may mắn
      </Heading>
      
      {loading ? (
        <Text textAlign="center">Đang tải dữ liệu...</Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={10}>
          {boxes.map((box) => (
            <BoxCard key={box.boxId} box={box} />
          ))}
        </SimpleGrid>
      )}
    </Container>
  );
};

export default LuckyBox;
