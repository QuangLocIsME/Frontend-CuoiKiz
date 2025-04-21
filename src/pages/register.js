"use client"

import { useState } from "react"
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Stack,
  Text,
  useColorModeValue,
  useToast,
  Alert,
  AlertIcon
} from "@chakra-ui/react"
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import axios from "axios";
import theme from "../theme"
import withoutAuth from "../hoc/withoutAuth";

function RegisterPage() {
  return <RegisterForm />
}

function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState("")
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState({})
  const toast = useToast()
  const navigate = useNavigate()

  const bgColor = useColorModeValue("white", "gray.800")
  const borderColor = useColorModeValue("gray.200", "gray.700")

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })

    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }

    // Clear server error when user makes any change
    if (serverError) {
      setServerError("")
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Fullname validation
    if (!formData.fullname.trim()) {
      newErrors.fullname = "Họ tên là bắt buộc"
    }

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Tên đăng nhập là bắt buộc"
    } else if (formData.username.length < 4) {
      newErrors.username = "Tên đăng nhập phải có ít nhất 4 ký tự"
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email là bắt buộc"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ"
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Mật khẩu là bắt buộc"
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự"
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu"
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Mật khẩu không khớp"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (validateForm()) {
      setIsLoading(true)
      setServerError("")

      try {
        // Gọi API đăng ký từ backend
        const response = await axios.post("http://localhost:5000/api/auth/register", {
          fullname: formData.fullname,
          username: formData.username,
          email: formData.email,
          password: formData.password
        });

        // Nếu đăng ký thành công
        toast({
          title: "Đăng ký thành công",
          description: "Tài khoản của bạn đã được tạo. Vui lòng đăng nhập.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        // Chuyển hướng đến trang đăng nhập
        navigate("/login");
      } catch (error) {
        console.error("Lỗi đăng ký:", error);
        
        // Hiển thị lỗi từ server
        if (error.response && error.response.data) {
          setServerError(error.response.data.message || "Đăng ký thất bại. Vui lòng thử lại.");
        } else {
          setServerError("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
        }
      } finally {
        setIsLoading(false);
      }
    }
  }

  return (
    <Container maxW="lg" py={{ base: "12", md: "24" }} px={{ base: "0", sm: "8" }}>
      <Stack spacing="8">
        <Stack spacing="6" textAlign="center">
          <Heading size="xl">Tạo tài khoản mới</Heading>
          <Text color="gray.500">Điền thông tin dưới đây để tạo tài khoản</Text>
        </Stack>

        <Box
          py={{ base: "0", sm: "8" }}
          px={{ base: "4", sm: "10" }}
          bg={bgColor}
          boxShadow="md"
          borderRadius="xl"
          borderWidth="1px"
          borderColor={borderColor}
        >
          {serverError && (
            <Alert status="error" mb={4} borderRadius="md">
              <AlertIcon />
              {serverError}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing="6">
              <Stack spacing="5">
                <FormControl isInvalid={errors.fullname}>
                  <FormLabel htmlFor="fullname">Họ tên</FormLabel>
                  <Input
                    id="fullname"
                    name="fullname"
                    placeholder="Nguyễn Văn A"
                    value={formData.fullname}
                    onChange={handleChange}
                  />
                  <FormErrorMessage>{errors.fullname}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors.username}>
                  <FormLabel htmlFor="username">Tên đăng nhập</FormLabel>
                  <Input
                    id="username"
                    name="username"
                    placeholder="username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                  <FormErrorMessage>{errors.username}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors.email}>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors.password}>
                  <FormLabel htmlFor="password">Mật khẩu</FormLabel>
                  <InputGroup>
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <InputRightElement>
                      <Button variant="ghost" size="sm" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{errors.password}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors.confirmPassword}>
                  <FormLabel htmlFor="confirmPassword">Xác nhận mật khẩu</FormLabel>
                  <InputGroup>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    <InputRightElement>
                      <Button variant="ghost" size="sm" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                        {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
                </FormControl>
              </Stack>

              <Stack spacing="4">
                <Button type="submit" colorScheme="blue" size="lg" isLoading={isLoading} loadingText="Đang tạo tài khoản">
                  Tạo tài khoản
                </Button>
              </Stack>

              <HStack spacing="1" justify="center">
                <Text color="gray.500">Đã có tài khoản?</Text>
                <Link as={RouterLink} to="/login" color="blue.500">
                  Đăng nhập
                </Link>
              </HStack>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Container>
  )
}

// Bọc component với HOC withoutAuth để ngăn người dùng đã đăng nhập truy cập trang đăng ký
export default withoutAuth(RegisterPage);
