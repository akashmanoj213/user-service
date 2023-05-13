import { Injectable } from '@nestjs/common';
import { CreateOrUpdateUserDto } from './dto/create-update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';
import { FirestoreService } from 'src/providers/firestore/firestore.service';

@Injectable()
export class UsersService {
  readonly USERS_COLLECTION = "users"

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
    private firestoreService: FirestoreService
  ) {}
  
  async create(createOrUpdateUserDto: CreateOrUpdateUserDto) {
    const { firstName, lastName, gender, dob, pincode, mobileNumber, email, isKycVerified, addresses = [] } = createOrUpdateUserDto;

    const existingUser: User = await this.userRepository.findOneBy({ mobileNumber });

    if(existingUser) {
      throw new Error(`mobileNuber: ${mobileNumber} is already in use for userid: ${existingUser.id} !}`)
    }

    let newAddresses: Array<Address> = [];

    addresses.forEach(address => {
      const {streetAddress1, streetAddress2, type, city, state, pincode } = address;

      const newAddress = {
        streetAddress1,
        streetAddress2,
        city,
        state,
        pincode,
        type
      }

      newAddresses.push(newAddress);
    })

    const user: User = {
      firstName,
      lastName,
      gender,
      dob,
      pincode,
      mobileNumber,
      email,
      isKycVerified,
      addresses: newAddresses
    }

    const result = await this.userRepository.save(user);

    return user;
  }

  async update(id, createOrUpdateUserDto: CreateOrUpdateUserDto) {
    const { firstName, lastName, gender, dob, pincode, mobileNumber, email, isKycVerified, addresses = [] } = createOrUpdateUserDto;

    let existingUser: User = await this.userRepository.findOneByOrFail({ id });

    let newAddresses: Array<Address> = [];

    addresses.forEach(address => {
      const {id, streetAddress1, streetAddress2, type, city, state, pincode } = address;

      const newAddress = {
        id,
        streetAddress1,
        streetAddress2,
        city,
        state,
        pincode,
        type
      }

      newAddresses.push(newAddress);
    })

    existingUser = {
      ...existingUser,
      firstName,
      lastName,
      gender,
      dob,
      pincode,
      mobileNumber,
      email,
      isKycVerified,
      addresses: newAddresses
    }

    const result = await this.userRepository.save(existingUser);

    return result;
  }

  async findAll() {
    return await this.firestoreService.findAll(this.USERS_COLLECTION);
  }

  async findOne(userId: number) {
    const res = await this.firestoreService.findById(this.USERS_COLLECTION, userId);

    if (!res.exists)
      return {}
    else
      return res.data;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async syncQueryDatabase(userId: number, user: CreateOrUpdateUserDto) {
    return await this.firestoreService.createOrUpdate<CreateOrUpdateUserDto>(this.USERS_COLLECTION, userId, user);
  }
}
