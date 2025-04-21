import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  FormErrorMessage,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton
} from '@chakra-ui/react';
import axios from 'axios';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const toast = useToast();

  const validate = () => {
    const newErrors = {};
    if (!oldPassword) newErrors.oldPassword = 'Vui lòng nhập mật khẩu hiện tại';
    if (!newPassword) newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
    if (newPassword && newPassword.length < 6) 
      newErrors.newPassword = 'Mật khẩu mới phải có ít nhất 6 ký tự';
    if (!confirmPassword) newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới';
    if (newPassword !== confirmPassword) 
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      const response = await axios.post(
        'https://intuitive-surprise-production.up.railway.app/api/auth/change-password',
        { oldPassword, newPassword },
        { withCredentials: true }
      );
      
      toast({
        title: 'Thành công',
        description: 'Mật khẩu đã được cập nhật thành công',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Reset form và đóng modal
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onClose();
    } catch (error) {
      console.error('Lỗi khi đổi mật khẩu:', error);
      
      toast({
        title: 'Lỗi',
        description: error.response?.data?.message || 'Đã xảy ra lỗi khi đổi mật khẩu',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Đổi Mật Khẩu</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isInvalid={errors.oldPassword}>
              <FormLabel>Mật khẩu hiện tại</FormLabel>
              <InputGroup>
                <Input
                  type={showOldPassword ? 'text' : 'password'}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
                <InputRightElement>
                  <IconButton
                    aria-label={showOldPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    icon={showOldPassword ? <ViewOffIcon /> : <ViewIcon />}
                    variant="ghost"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                  />
                </InputRightElement>
              </InputGroup>
              {errors.oldPassword && <FormErrorMessage>{errors.oldPassword}</FormErrorMessage>}
            </FormControl>

            <FormControl isInvalid={errors.newPassword}>
              <FormLabel>Mật khẩu mới</FormLabel>
              <InputGroup>
                <Input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <InputRightElement>
                  <IconButton
                    aria-label={showNewPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    icon={showNewPassword ? <ViewOffIcon /> : <ViewIcon />}
                    variant="ghost"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  />
                </InputRightElement>
              </InputGroup>
              {errors.newPassword && <FormErrorMessage>{errors.newPassword}</FormErrorMessage>}
            </FormControl>

            <FormControl isInvalid={errors.confirmPassword}>
              <FormLabel>Xác nhận mật khẩu mới</FormLabel>
              <InputGroup>
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <InputRightElement>
                  <IconButton
                    aria-label={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                    variant="ghost"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                </InputRightElement>
              </InputGroup>
              {errors.confirmPassword && <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>}
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={handleClose}>
            Hủy
          </Button>
          <Button 
            colorScheme="blue" 
            onClick={handleSubmit} 
            isLoading={isLoading}
          >
            Cập Nhật
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ChangePasswordModal; 
