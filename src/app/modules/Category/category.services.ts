import { Request } from "express";
import { fileUploader } from "../../../helpers/fileUploader";
import prisma from "../../../share/prisma";
import { IFile } from "../../interfaces/file";
import pick from "../../../share/pick";
import { categoriesFilterableFields, categoriesFilterableOptions, categoriesSearchAbleFields } from "./category.constant";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { Prisma } from "@prisma/client";
import { date } from "zod";




const createACategory = async (req:Request )=>{
   
   
    
    const {category}= req.body;
  
   const isNotExitsCategory = await prisma.category.findUnique({
        where: { name: category.name },
    });
    if (isNotExitsCategory) {
        throw new Error("Category already exists");
    }
    

    const file =req.file as IFile;
    let image: string|null = null
    if (file) {
        image = file.path
    }
   
   

    const CategoryData = {
        name:category.name,
        description: category.description,
        image: image 
    };

        const result = await prisma.category.create({
            data: CategoryData,
           
        })


    return result;
    
}

const getAllCategoryFromDB = async ()=>{
    const result = await prisma.category.findMany({
        where: {
            isDeleted: false,
        },
        include: {
            products: true,
        },
    });

    return result       
   };


const getAllCategory = async (req:Request)=>{

    const filters = pick(req.query, categoriesFilterableFields);
    const options = pick(req.query, categoriesFilterableOptions)

    const {sortBy, sortOrder,page,limit,skip}= paginationHelper.calculatePagination(options);
    const {searchTerm,...filterData}= filters;
    const andConditions: Prisma.CategoryWhereInput[]=[{ isDeleted: false },];

    if(searchTerm){
        andConditions.push({
            OR: categoriesSearchAbleFields.map(field=>({
                [field]:{
                    contains: searchTerm,
                    mode: 'insensitive'
                }
            }))
        })
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: (filterData as any)[key]
                }
            }))
        })
    };

    const whereConditons: Prisma.CategoryWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

   
    const allCategories = await prisma.category.findMany({
        where: whereConditons,
        skip,
        take:limit,
        orderBy: sortBy && sortOrder ? {
            [sortBy as string]: sortOrder
        } : {
            createdAt: 'desc'
        },
        include:{
               products:true
        }
  });
 
  const transformedCategories = allCategories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    logo: cat.image,
    description: cat.description,
    totalProducts: cat.products.length || 0,
  }));


    const total = await prisma.category.count({
        where: whereConditons
    })



    return {
        paginateData:{
            total,
            limit,
            page
        },
        data: transformedCategories
    };
}

const deleteCategory = async (req: Request) => {
    try {
      const categoryId =parseInt( req.params.categoryId);
  
      const isNotExitscategory = await prisma.category.findUnique({
        where: { id: categoryId },
      });
  
      if (!isNotExitscategory) {
        throw new Error("category not found");
      }
  
      // Update related data
    
      await prisma.product.updateMany({ 
        where: { categoryId: categoryId },
        data :{
            categoryId: 1 //1 mean other category
        }
    
    },
        
      );
  
      // Delete the category
      const result = await prisma.category.update({
        where: { id: categoryId },
        data: {
          isDeleted: true
        }
      });
  
      return result;
    } catch (err) {
      throw new Error("An error occurred while deleting the category and related data");
    }
  };


  const updateCategory = async (req: Request) => {
    try {
        const  categoryId  = parseInt(req.params.categoryId);
        const isNotExitsCategory = await prisma.category.findUnique({
            where: { id: categoryId },
        });

        if (!isNotExitsCategory) {
            throw new Error("Category not found");
        }



       
        const file = req.file as IFile ;

      

        // Upload profile photo if provided
        let image: string | null = null;
        if (file) {
            image = file.path
        }

        const updateData: Record<string, any> = { ...req.body };
        if (image) {
            updateData.image = image;
        }

        // Update the Category
        const updatedCategory = await prisma.category.update({
            where: { id: categoryId },
            data: updateData,
        });

        return updatedCategory;
    } catch (error) {
        console.error('Error updating Category:', error);
      
    }
};

const getOnlyCategory = async (req: Request) => {
    try {
        const categoryId = parseInt(req.params.categoryId);
        const category = await prisma.category.findUnique({
            where: { id: categoryId },
            include: {
                products: true
            }
        });
        return category;
    } catch (error) {
        console.error('Error fetching Category:', error);   
    }
};



export const CategoryServices = {
    createACategory,
    getAllCategory,
    deleteCategory,
    updateCategory,
    getOnlyCategory,
    getAllCategoryFromDB
}