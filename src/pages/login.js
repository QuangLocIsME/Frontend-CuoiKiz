"use client"

import React, { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Stack,
  Text,
  useColorModeValue,
  IconButton,
  useColorMode,
  Alert,
  AlertIcon,
  FormErrorMessage
} from '@chakra-ui/react';
import { FaFacebook, FaGoogle, FaApple } from "react-icons/fa"
import { FiEye, FiEyeOff, FiMoon, FiSun } from "react-icons/fi"
import axios from 'axios';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import withoutAuth from '../hoc/withoutAuth';

function LoginPage() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loginError, setLoginError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();

  const bgColor = useColorModeValue("white", "gray.800")
  const textColor = useColorModeValue("gray.800", "white")
  const borderColor = useColorModeValue("gray.200", "gray.700")

  const validateForm = () => {
    let isValid = true;
    
    if (!login) {
      setLoginError('Vui lòng nhập tên đăng nhập hoặc email');
      isValid = false;
    } else {
      setLoginError('');
    }
    
    if (!password) {
      setPasswordError('Vui lòng nhập mật khẩu');
      isValid = false;
    } else {
      setPasswordError('');
    }
    
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('/api/auth/login', {
        login,
        password
      }, {
        withCredentials: true // Quan trọng để nhận cookie từ response
      });
      
      // Lưu thông tin user vào localStorage hoặc state management
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Kiểm tra vai trò người dùng và chuyển hướng đến trang phù hợp
      if (response.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
      
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      if (error.response) {
        setError(error.response.data.message || 'Đăng nhập thất bại');
      } else {
        setError('Không thể kết nối đến máy chủ');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg={useColorModeValue("gray.50", "gray.900")}>
      <IconButton
        icon={colorMode === "light" ? <FiMoon /> : <FiSun />}
        onClick={toggleColorMode}
        position="absolute"
        top="4"
        right="4"
        variant="ghost"
        aria-label="Toggle color mode"
      />

      <Container maxW="lg" py={{ base: "12", md: "24" }} px={{ base: "0", sm: "8" }}>
        <Stack spacing="8">
          <Box
            py={{ base: "0", sm: "8" }}
            px={{ base: "4", sm: "10" }}
            bg={bgColor}
            boxShadow={{ base: "none", sm: "md" }}
            borderRadius={{ base: "none", sm: "xl" }}
            borderWidth="1px"
            borderColor={borderColor}
          >
            <Stack spacing="6">
              <Stack spacing={{ base: "2", md: "3" }} textAlign="center">
                <Heading size={{ base: "xs", md: "sm" }} color={textColor}>
                  Đăng nhập vào tài khoản của bạn
                </Heading>
                <HStack spacing="1" justify="center">
                  <Text color="muted">Bạn chưa có tài khoản?</Text>
                  <Link color="blue.500" href="#">
                    Đăng ký
                  </Link>
                </HStack>
              </Stack>

              <Stack spacing="6">
                <form onSubmit={handleSubmit}>
                  <Stack spacing={4}>
                    {error && (
                      <Alert status="error">
                        <AlertIcon />
                        {error}
                      </Alert>
                    )}
                    
                    <FormControl id="login" isInvalid={!!loginError}>
                      <FormLabel>Tên đăng nhập hoặc Email</FormLabel>
                      <Input
                        type="text"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                      />
                      {loginError && <FormErrorMessage>{loginError}</FormErrorMessage>}
                    </FormControl>
                    
                    <FormControl id="password" isInvalid={!!passwordError}>
                      <FormLabel>Mật khẩu</FormLabel>
                      <InputGroup>
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <InputRightElement width="4.5rem">
                          <Button
                            h="1.75rem"
                            size="sm"
                            onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? 'Ẩn' : 'Hiện'}
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                      {passwordError && <FormErrorMessage>{passwordError}</FormErrorMessage>}
                    </FormControl>
                    
                    <Stack spacing={10}>
                      <Stack
                        direction={{ base: 'column', sm: 'row' }}
                        align={'start'}
                        justify={'space-between'}>
                        <Text color={'blue.400'} cursor="pointer">
                          Quên mật khẩu?
                        </Text>
                      </Stack>
                      <Button
                        bg={'blue.400'}
                        color={'white'}
                        _hover={{
                          bg: 'blue.500',
                        }}
                        type="submit"
                        isLoading={isLoading}
                        loadingText="Đang đăng nhập">
                        Đăng nhập
                      </Button>
                      <Text align={'center'}>
                        Chưa có tài khoản?{' '}
                        <Link as={RouterLink} to="/register" color={'blue.400'}>
                          Đăng ký ngay
                        </Link>
                      </Text>
                    </Stack>
                  </Stack>
                </form>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Flex>
  )
}

// Bọc component với HOC withoutAuth, đảm bảo đã đăng nhập thì không vào được trang login
export default withoutAuth(LoginPage);
