import React from "react";
import { useState,useMemo } from "react";
import api from "@/product/api";
import { Product } from "@/product/types";
import { GetStaticProps } from "next";
import { Button, Grid, Stack, Text, Link, Image, Flex, useBreakpointValue } from "@chakra-ui/react";
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
interface Props {
  products: Product[]
}

const IndexRoute: React.FC<Props> = ({ products }) => {
  const buttonSize = useBreakpointValue({ base: 'sm', md: 'lg' });

  //creamos el estado del carrito
  const [cart, setCart] = useState<Product[]>([]);
  //si el componente se renderiza muchas veces no importa, usaremos useMemo
  //useMemo se ejecutara solo cuando cambie algo en cart
  const text = useMemo(() =>
    cart.reduce((message, product) => message.concat(` * ${product.title} - $${parseCurrency(product.price)}\n`), ``,)
      .concat(`\nTotal: $${parseCurrency(cart.reduce((total, product) => total + product.price, 0))}`), [cart]);
  
  //parseCurrency convierte el number a string correspondiente de la moneda local.
  function parseCurrency(value: number): string{
    //.slice(3) obtiene el primer 3 caracteres del string del product.price,
    //viene ARS incorporado y yo se lo saco con slice(3)
    return value.toLocaleString('en-AR', { style: 'currency', currency: 'ARS' }).slice(3);
  }
  return (
    <LayoutGroup>
    <Stack spacing={6}>
      <Grid gridGap={6} templateColumns={"repeat(auto-fill, minmax(240px, 1fr))"}>
        {products.map((product) => (
          <Stack justify={'space-between'} spacing={3} key={product.id} backgroundColor={"gray.100"} padding={4} borderRadius={'sm'}>
            <Image borderTopRadius='md' maxHeight={128} objectFit='cover' src={product.image}/>
          <Stack spacing={1}>
            <Text>{product.title}</Text>
            <Text fontSize={'md'} fontWeight={500} color={"green.500"}>${parseCurrency(product.price)}</Text>
          </Stack>
          <Button
            size={'sm'}
            variant={'outline'}
            colorScheme="primary"
            onClick={() => setCart([...cart, product])}>Agregar</Button>
        </Stack>
      ))}
      </Grid>
      {/* //solo se muestra si tenemos productos agregados alen el carrito */}
      {/* encodeURIComponent() se asegura de que el text que le pasamos sea escapado correctamente
      para viajar en una url, cambia los espacios por caracteristicas que puede viajar en la url */}
        {Boolean(cart.length) &&
        <AnimatePresence>
            <Flex
              as={motion.div}
              initial={{scale: 0}}
              animate={{scale: 1}}
              exit={{scale: 0}}
              padding={4}
              justifyContent={'center'}
              alignItems={'center'}
              position={"sticky"}
              bottom={0}>
          <Button
            width='fit-content'
            size={buttonSize}
            margin="auto"
            as={Link} isExternal
            href={`https://wa.me/3413052736?text=${encodeURIComponent(text)}`}
            leftIcon={<Image src="https://icongr.am/fontawesome/whatsapp.svg?size=32&color=ffffff" />}
            colorScheme="whatsapp">Finalizar pedido ({cart.length} productos) </Button>
            </Flex>
          </AnimatePresence>
      }
      </Stack>
      </LayoutGroup>
    )
  }
  
  export const getStaticProps: GetStaticProps = async () => {
    const products = await api.list();
    return {
      revalidate:10,
      props: {
        products,
      }
    }
  }

export default IndexRoute;