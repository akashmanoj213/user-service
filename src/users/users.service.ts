import { Injectable } from '@nestjs/common';
import { CreateOrUpdateUserDto } from './dto/create-update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';
import { FirestoreService } from 'src/providers/firestore/firestore.service';
import { DateTime } from "luxon";

@Injectable()
export class UsersService {
  readonly USERS_COLLECTION = "users"

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
    private firestoreService: FirestoreService
  ) { }

  async create(createOrUpdateUserDto: CreateOrUpdateUserDto) {
    const { firstName, lastName, gender, dob, pincode, mobileNumber, email, isKycVerified, addresses } = createOrUpdateUserDto;

    const dateOfBirth = DateTime.fromISO(dob); 
    if(dateOfBirth.invalid) {
      throw new Error(dateOfBirth.invalid.explanation);
    }

    const existingUser: User = await this.userRepository.findOneBy({ mobileNumber });

    if (existingUser) {
      throw new Error(`mobileNuber: ${mobileNumber} is already in use for userid: ${existingUser.id}!}`)
    }

    let newAddresses;

    if (addresses && addresses.length > 0) {
      newAddresses = addresses.map(address => {
        const { streetAddress1, streetAddress2, type, city, state, pincode } = address;

        return {
          streetAddress1,
          streetAddress2,
          city,
          state,
          pincode,
          type
        };
      });
    }

    const user: User = {
      firstName,
      lastName,
      gender,
      dob: dateOfBirth.toSQLDate(),
      pincode,
      mobileNumber,
      email,
      isKycVerified,
      addresses: newAddresses
    }

    await this.userRepository.save(user);

    return user;
  }

  async update(id, createOrUpdateUserDto: CreateOrUpdateUserDto) {
    const { firstName, lastName, gender, dob, pincode, mobileNumber, email, isKycVerified, addresses: newAddresses } = createOrUpdateUserDto;

    const dateOfBirth = DateTime.fromISO(dob);
    if(dateOfBirth.invalid) {
      throw new Error(dateOfBirth.invalid.explanation);
    }

    let existingUser: User = await this.userRepository.findOneByOrFail({ id });

    let addresses: Array<Address>;

    if (newAddresses && newAddresses.length > 0) {
      addresses = newAddresses.map(address => {
        const { id, streetAddress1, streetAddress2, type, city, state, pincode } = address;

        return {
          id,
          streetAddress1,
          streetAddress2,
          city,
          state,
          pincode,
          type
        };
      });
    }

    existingUser = {
      ...existingUser,
      ...firstName && { firstName },
      ...lastName && { lastName },
      ...gender && { gender },
      ...dateOfBirth && { dob: dateOfBirth.toSQLDate() },
      ...pincode && { pincode },
      ...mobileNumber && { mobileNumber },
      ...email && { email },
      ...(isKycVerified !== undefined) && { isKycVerified },
      ...addresses && { addresses }
    }

    await this.userRepository.save(existingUser);

    return existingUser;
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
    console.log("Firestore user", user);
    return await this.firestoreService.createOrUpdate<CreateOrUpdateUserDto>(this.USERS_COLLECTION, userId, user);
  }
}
