import { Client } from "https://deno.land/x/postgres/mod.ts";
import { v4 } from "https://deno.land/std/uuid/mod.ts";
import { Product, ReqResHandler, ReqBody } from "../types.ts";
import { dbCreds } from "../config.ts";

// Initialise DB client
const client = new Client(dbCreds);

let products: Product[] = [
  {
    id: "1",
    name: "Product One",
    description: "This is product one",
    price: 29.99,
  },
  {
    id: "2",
    name: "Product Two",
    description: "This is product two",
    price: 39.99,
  },
  {
    id: "3",
    name: "Product Three",
    description: "This is product three",
    price: 25.99,
  },
];

// @desc   Get All Products
// @route  GET /api/v1/products
const getProducts = async ({ response }: ReqResHandler) => {
  // response.body = {
  //   sucess: true,
  //   data: products,
  // };
  try {
    await client.connect();
    const result = await client.query("SELECT * FROM products");
    console.log("result", result);
    const products = new Array();
    result.rows.map((product) => {
      let obj: any = new Object();
      result.rowDescription.columns.map((ele, i) => {
        obj[ele.name] = product[i];
      });
      products.push(obj);
    });
    response.status = 200;
    response.body = {
      sucess: true,
      data: products,
    };
  } catch (err) {
    response.status = 500;
    response.body = {
      sucess: false,
      msg: err.toString(),
    };
  } finally {
    await client.end();
  }
};

// @desc   Get single Product
// @route  GET /api/v1/products/:id
const getProduct = async ({ params, response }: ReqResHandler) => {
  // const product: Product | undefined = products.find((product: Product) =>
  //   params && params.id && product.id === params.id
  // );
  // if (product) {
  //   response.body = {
  //     sucess: true,
  //     data: product,
  //   };
  // } else {
  //   response.status = 404;
  //   response.body = {
  //     sucess: false,
  //     msg: "No product found",
  //   };
  // }
  try {
    await client.connect();
    const result = await client.query(
      "SELECT * FROM products WHERE id = $1",
      params.id,
    );
    if (result.rows.toString() === "") {
      response.status = 404;
      response.body = {
        sucess: false,
        msg: `No product with the id of ${params.id}`,
      };
    } else {
      const product: any = new Object();
      result.rows.map((prod) => {
        result.rowDescription.columns.map((ele, i) => {
          product[ele.name] = prod[i];
        });
      });
      response.body = {
        sucess: true,
        data: product,
      };
    }
  } catch (err) {
    response.status = 500;
    response.body = {
      sucess: false,
      msg: err.toString(),
    };
  } finally {
    await client.end();
  }
};

// @desc   Add single Product
// @route  POST /api/v1/products
const addProduct = async ({ request, response }: ReqResHandler) => {
  const body: ReqBody = await request.body();
  const product: Product = body.value;
  const { name, description, price } = product;
  if (!request.hasBody) {
    response.status = 400;
    response.body = {
      sucess: false,
      msg: "Missing Body",
    };
  } else {
    // const product: Product = body.value;
    // product.id = v4.generate();
    // products.push(product);
    // response.status = 201;
    // response.body = {
    //   sucess: true,
    //   msg: "Product added succefully",
    //   data: product,
    // };
    try {
      await client.connect();
      const result = await client.query(
        "INSERT INTO products(name,description,price) VALUES($1,$2,$3)",
        name,
        description,
        price,
      );
      console.log("result", result);
      response.status = 201;
      response.body = {
        sucess: true,
        msg: "Product added succefully",
        data: product,
      };
    } catch (err) {
      response.status = 500;
      response.body = {
        sucess: false,
        msg: err.toString(),
      };
    } finally {
      await client.end();
    }
  }
};

// @desc   Update single Product
// @route  PUT /api/v1/products/:id
const updateProduct = async ({ request, params, response }: ReqResHandler) => {
  // const product: Product | undefined = products.find((prod: Product) =>
  //   params && params.id && prod.id === params.id
  // );
  // if (product) {
  //   const body: ReqBody = await request.body();
  //   const updatedProduct: Product = body.value;
  //   console.log("updatedProduct", updatedProduct);
  //   if (request.hasBody) {
  //     products = products.map((prod: Product) =>
  //       params && params.id && prod.id === params.id
  //         ? { ...prod, ...updatedProduct }
  //         : prod
  //     );
  //     response.body = {
  //       sucess: true,
  //       msg: "Product updated succesfully",
  //       data: products,
  //     };
  //   } else {
  //     response.status = 400;
  //     response.body = {
  //       success: false,
  //       msg: "Missing Body",
  //     };
  //   }
  // } else {
  //   response.status = 404;
  //   response.body = {
  //     success: false,
  //     msg: "No product found",
  //   };
  // }
  await getProduct({ params: { "id": params.id }, response });
  if (response.status === "404") {
    response.status = 404;
    response.body = {
      sucess: false,
      msg: response.body.msg,
    };
    return;
  } else {
    const body = await request.body();
    const product = body.value;
    const { name, description, price } = product;
    if (!request.hasBody) {
      response.status = 400;
      response.body = {
        sucess: false,
        msg: "Missing Body",
      };
    } else {
      try {
        await client.connect();
        const result = await client.query(
          "UPDATE products SET name=$1, description=$2, price=$3 WHERE id=$4",
          name,
          description,
          price,
          params.id,
        );

        response.status = 200;
        response.body = {
          sucess: true,
          msg: "Product updated succefully",
          data: product,
        };
      } catch (err) {
        response.status = 500;
        response.body = {
          sucess: false,
          msg: err.toString(),
        };
      } finally {
        await client.end();
      }
    }
  }
};

// @desc   Delete single Product
// @route  DELETE /api/v1/products/:id
const deleteProduct = async ({ params, response }: ReqResHandler) => {
  // const product: Product | undefined = products.find((prod: Product) =>
  //   params && params.id && prod.id === params.id
  // );
  // if (product) {
  //   response.body = {
  //     sucess: true,
  //     msg: "Product Removed Succesfully",
  //     data: products.filter((prod: Product) =>
  //       params && params.id && params.id !== prod.id
  //     ),
  //   };
  // } else {
  //   response.status = 404;
  //   response.body = {
  //     success: false,
  //     msg: "No product found",
  //   };
  // }
  await getProduct({ params: { "id": params.id }, response });
  if (response.status === "404") {
    response.status = 404;
    response.body = {
      sucess: false,
      msg: response.body.msg,
    };
    return;
  } else {
    try {
      await client.connect();
      const result = await client.query(
        "DELETE FROM products WHERE id=$1",
        params.id,
      );
      response.status = 204;
      response.body = {
        sucess: true,
        msg: `Product with id ${params.id} deleted succefully`,
      };
    } catch (err) {
      response.status = 500;
      response.body = {
        sucess: false,
        msg: err.toString(),
      };
    } finally {
      await client.end();
    }
  }
};
export { getProducts, getProduct, addProduct, updateProduct, deleteProduct };
