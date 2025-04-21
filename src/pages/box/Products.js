import React, { useState, useEffect } from 'react';
import { Box, Image, Text, Button, SimpleGrid, VStack, HStack, Spinner, Badge } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import boxApi from '../../api/boxApi'; // Import boxApi

const boxTypes = ["ALL", "LOVA", "MEDI", "HIGV", "EVNT", "RAND"];

const Products = () => {
  const [boxes, setBoxes] = useState([]); // State để lưu danh sách box
  const [selectedType, setSelectedType] = useState("ALL"); // Mặc định chọn "ALL"
  const [loading, setLoading] = useState(true); // State để theo dõi trạng thái tải
  const [currentPage, setCurrentPage] = useState(1); // State cho trang hiện tại
  const [itemsPerPage] = useState(6); // Số lượng vật phẩm trên mỗi trang
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

  // Tính toán danh sách box cho trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBoxes.slice(indexOfFirstItem, indexOfLastItem);

  // Tính tổng số trang
  const totalPages = Math.ceil(filteredBoxes.length / itemsPerPage);

  // Xử lý chuyển trang
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Xử lý khi nhấn vào boxType
  const handleTypeChange = (type) => {
    setSelectedType(type);
    setCurrentPage(1); // Chuyển về trang đầu tiên
  };

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
            onClick={() => handleTypeChange(type)} // Chuyển về trang đầu tiên khi chọn loại
          >
            {type}
          </Button>
        ))}
      </HStack>

      {/* Danh sách box được lọc */}
      <SimpleGrid columns={[1, 2, 3]} spacing={5}>
        {currentItems.map((box, index) => {
          const discountedPrice = box.discount
            ? Math.round(box.price * (1 - box.discount / 100))
            : box.price;

          const discountedCoinPrice = box.discount
            ? Math.round(box.coinPrice * (1 - box.discount / 100))
            : box.coinPrice;

          return (
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
              {box.discount > 0 ? (
                <>
                  <Badge colorScheme="yellow">{box.discount}% OFF</Badge>
                  <Text fontWeight="bold" color="teal.500">
                    Giá sau giảm: {discountedPrice.toLocaleString()} VND
                  </Text>
                  <Text fontWeight="bold" color="teal.500">
                    Giá Coin sau giảm: {discountedCoinPrice.toLocaleString()} Coin
                  </Text>
                </>
              ) : (
                <>
                  <Text fontWeight="bold" color="gray.700">
                    Giá: {box.price.toLocaleString()} VND
                  </Text>
                  <Text fontWeight="bold" color="gray.700">
                    Giá Coin: {box.coinPrice.toLocaleString()} Coin
                  </Text>
                </>
              )}
              <Button colorScheme="teal" onClick={() => handleViewDetail(box)}>
                Xem chi tiết
              </Button>
            </VStack>
          );
        })}
      </SimpleGrid>

      {/* Phân trang */}
      <HStack mt={5} justify="center" spacing={2}>
        <Button
          colorScheme="teal"
          isDisabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Trước
        </Button>
        {Array.from({ length: totalPages }, (_, index) => (
          <Button
            key={index + 1}
            colorScheme="teal"
            variant={index + 1 === currentPage ? "solid" : "outline"} // Tô màu cho trang hiện tại
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Button>
        ))}
        <Button
          colorScheme="teal"
          isDisabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Tiếp
        </Button>
      </HStack>
    </Box>
  );
};

export default Products;