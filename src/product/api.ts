import axios from "axios";
import Papa from "papaparse";
import { Product } from "./types";

export default {
  list: async (): Promise<Product[]> =>{
      return axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vQS1CAFfnZSkJPl7KWroT_wUD43wGAR8siD63tMu7or6PZ1IX2Z9lA8YZQSIhUyI0eaEFgFGANAHmSO/pub?output=csv',
        {
            responseType: 'blob'
        }
      ).then((response) => {
         //Papa parse no acepta el uso de async await, por eso debemos hacerle un new promise propio
          return new Promise<Product[]>((resolve, reject) => {
            Papa.parse(response.data, {
               //header:true indica a papaparse que el primer elemento de nuestro arrays
               //es el header de nuestra tabla. Nos armará el json correctamente
              header: true,
               //complete es una funcion que tiene los results de haber parseado los objetos
               //en un formato correcto como vemos abajo
                complete: (results) => {
                  const products = results.data as Product[];
                  
                  /* return resolve(products); */
                  return resolve(
                      products.map((product) => ({
                        ...product,
                        price: Number(product.price),
                    })),
                  );
                },
               //error es una funcion que mos trara si la promosea no se cumplio, a traves de reject
              error: (error) =>reject(error.message)
            })
        })
      })
  }
}