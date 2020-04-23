import { getRepository, getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import TransactionRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  category: string;
  title: string;
  type: 'income' | 'outcome';
  value: number;
}

class CreateTransactionService {
  public async execute({
    category,
    title,
    type,
    value,
  }: Request): Promise<Transaction> {
    const categoryRepository = getRepository(Category);
    const transactionsRepository = getCustomRepository(TransactionRepository);

    const checkCategoryExists = await categoryRepository.findOne({
      where: { title: category },
    });

    let category_id;

    if (!checkCategoryExists) {
      const newCategory = categoryRepository.create({ title: category });

      category_id = await (await categoryRepository.save(newCategory)).id;
    } else {
      category_id = checkCategoryExists.id;
    }

    const balance = await transactionsRepository.getBalance();

    if (type === 'outcome' && balance.total < value) {
      throw new AppError('Value to high', 400);
    }

    const transaction = transactionsRepository.create({
      category_id,
      title,
      type,
      value,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
