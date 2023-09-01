// src/task/task.service.ts
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entity/auth.entity';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Registers a new user with the provided username and password.
   * @param username The desired username for the new user.
   * @param password The password for the new user.
   * @returns The created user entity.
   */
  async register(username: string, password: string): Promise<RegisterDto> {
    // Check if a user with the same username already exists
    const existingUser = await this.userRepository.findOne({
      where: { username },
    });
    if (existingUser) {
      throw new BadRequestException('Username is already taken');
    }

    // Hash the password and create a new user entity
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.userRepository.create({
      username,
      password: hashedPassword,
    });

    // Save the new user
    return await this.userRepository.save(newUser);
  }

  /**
   * Logs in a user with the provided username and password.
   * @param username The username of the user.
   * @param password The password of the user.
   * @returns A response containing an access token and a message indicating successful login.
   */
  async login(username: string, password: string): Promise<any> {
    // Find the user by the provided username
    const user = await this.userRepository.findOne({ where: { username } });

    // Check if the user exists and the password matches
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Create a JWT payload with the username and user ID
    const payload = { username: user.username, sub: user.id };

    // Generate an access token using the JWT service
    const accessToken = await this.jwtService.sign(payload);

    // Construct a data object with the access token and a success message
    const data = {
      accessToken: accessToken,
      message: 'LoggedIn',
    };

    // Generate a response data object using the responseData method
    return this.responseData(data);
  }

  /**
   * Validates a JWT user based on the payload.
   * @param payload The payload of the JWT token.
   * @returns The user entity associated with the payload.
   */
  async validateJwtUser(payload: any) {
    const userId = payload.sub;
    const user = await this.userRepository.findOne({ where: { id: userId } }); // Use findOne with 'where'

    if (!user) {
      throw new UnauthorizedException('Invalid user');
    }

    return user;
  }

  async validateToken(data: any): Promise<any> {
    let { token } = data;
    try {
      // Verify the token's signature
      const decodedToken = this.jwtService.verify(token);

      // You can also check the token's expiration here if needed
      // const isTokenExpired = Date.now() >= decodedToken.exp * 1000;

      // Perform additional checks like token revocation if necessary

      return decodedToken;
    } catch (error) {
      // Token validation failed
      throw new UnauthorizedException('Invalid token');
    }
  }

  /**
   * Constructs a response data object with the provided access token and message.
   * @param _data The data to be included in the response.
   * @returns A response data object containing the provided data and a message.
   */
  async responseData(_data: any): Promise<any> {
    // Log the provided data for debugging purposes
    console.log(_data);

    // Construct a response data object with a message and the provided data
    const data = {
      message: _data.message,
      data: {
        accessToken: _data.accessToken,
      },
    };

    // Return the response data object
    return data;
  }
}
