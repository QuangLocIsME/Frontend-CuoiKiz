import React, { useEffect, useState } from 'react';
import droprateApi from '../../api/droprateApi';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  Input,
  Heading,
  Flex,
  Tag,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';

const BoxTypeChanceManagement = () => {
  const [dropRates, setDropRates] = useState([]);
  const [editingBoxType, setEditingBoxType] = useState(null);
  const [formData, setFormData] = useState({});
  const toast = useToast();

  // Sử dụng useColorModeValue để tự động đổi màu theo theme
  const boxBg = useColorModeValue('gray.50', 'gray.800');
  const headingColor = useColorModeValue('blue.600', 'blue.300');
  const tableStripedColor = useColorModeValue('blue', 'cyan');
  const boxTypeColor = useColorModeValue('green.500', 'green.300');
  const inputBg = useColorModeValue('white', 'gray.700'); // Thêm dòng này

  // Hàm chọn màu cho từng loại tỷ lệ
  const getChanceColor = (key) => {
    switch (key) {
      case 'common':
        return 'gray';
      case 'uncommon':
        return 'green';
      case 'rare':
        return 'blue';
      case 'epic':
        return 'purple';
      case 'legendary':
        return 'orange';
      case 'event':
        return 'red';
      default:
        return 'gray';
    }
  };

  useEffect(() => {
    const fetchDropRates = async () => {
      try {
        const data = await droprateApi.getAllDropRates();
        if (data.success) {
          setDropRates(data.data);
        } else {
          setDropRates([]);
        }
      } catch (error) {
        setDropRates([]);
      }
    };
    fetchDropRates();
  }, []);

  const handleEdit = (boxType, chances) => {
    setEditingBoxType(boxType);
    setFormData(chances);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: Number(value) });
  };

  const handleSave = async () => {
    try {
      await droprateApi.updateDropRate(editingBoxType, formData);
      setDropRates((prev) =>
        prev.map((rate) =>
          rate.boxType === editingBoxType ? { ...rate, chances: formData } : rate
        )
      );
      setEditingBoxType(null);
      setFormData({});
      toast({
        title: 'Cập nhật thành công!',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Cập nhật thất bại!',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleCancel = () => {
    setEditingBoxType(null);
    setFormData({});
  };

  return (
    <Box maxW="1100px" mx="auto" mt={10} p={6} bg={boxBg} borderRadius="lg" boxShadow="md">
      <Heading mb={6} color={headingColor} textAlign="center" fontSize="2xl">
        Quản lý tỷ lệ rơi vật phẩm
      </Heading>
      <TableContainer>
        <Table colorScheme={tableStripedColor} size="md">
          <Thead>
            <Tr>
              <Th textAlign="center">Loại hộp</Th>
              <Th textAlign="center">Tỷ lệ rơi</Th>
              <Th textAlign="center">Thao tác</Th>
            </Tr>
          </Thead>
          <Tbody>
            {Array.isArray(dropRates) && dropRates.length > 0 ? (
              dropRates.map(({ boxType, chances }) => (
                <Tr key={boxType}>
                  <Td fontWeight="bold" color={boxTypeColor} textAlign="center" bg="transparent">{boxType}</Td>
                  <Td>
                    {editingBoxType === boxType ? (
                      <Flex wrap="wrap" gap={3} justify="center">
                        {Object.keys(chances).map((key) => (
                          <Flex key={key} align="center">
                            <Box fontWeight="500" mr={1} color={`${getChanceColor(key)}.500`}>
                              {key}:
                            </Box>
                            <Input
                              size="sm"
                              width="70px"
                              name={key}
                              type="number"
                              value={formData[key] || ''}
                              onChange={handleChange}
                              min={0}
                              mr={2}
                              bg={inputBg}
                            />
                          </Flex>
                        ))}
                      </Flex>
                    ) : (
                      <Flex wrap="wrap" gap={2} justify="center">
                        {Object.entries(chances).map(([key, value]) => (
                          <Tag
                            key={key}
                            colorScheme={getChanceColor(key)}
                            variant="subtle"
                            fontWeight="600"
                          >
                            {key}: {value}
                          </Tag>
                        ))}
                      </Flex>
                    )}
                  </Td>
                  <Td textAlign="center">
                    {editingBoxType === boxType ? (
                      <>
                        <Button colorScheme="green" size="sm" mr={2} onClick={handleSave}>
                          Lưu
                        </Button>
                        <Button colorScheme="red" size="sm" onClick={handleCancel}>
                          Hủy
                        </Button>
                      </>
                    ) : (
                      <Button colorScheme="blue" size="sm" onClick={() => handleEdit(boxType, chances)}>
                        Sửa
                      </Button>
                    )}
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={3} textAlign="center">
                  Không có dữ liệu
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default BoxTypeChanceManagement;
