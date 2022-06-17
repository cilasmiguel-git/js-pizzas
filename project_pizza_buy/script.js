/*essa função serve para eu não ficar escrevendo toda hora queryselectorall*/
const c = (el)=> document.querySelector(el);
/*essa função serve para eu não ficar escrevendo toda hora queryselectorall*/
const cs = (el)=> document.querySelectorAll(el);
let cart =[];//  <---É o nosso carrinho
let modalQt;
let modalKey = 0;
pizzaJson.map//o map desconstroi o array
( 

    (item , index)=>
    { /*prenche as informações em pizza item*/

      //faz copias
      let pizzaItem = c('.models .pizza-item').cloneNode(true);//cloneNode() duplica um elemento node (nó) da estrutura de um documento DOM. nesse caso ele pegou os 7 'id' e trouse para o arq js

                      //coloca imagens 
                      pizzaItem.querySelector('.pizza-item--img img').src = item.img;

                      //colocando informações
                      pizzaItem.querySelector('.pizza-item--price').innerHTML =`R$ ${item.price.toFixed(2)}`;//o tofixed deixa todos os valores obrigatoriamente com 2 zeros depos da virgula
                      pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;//usa pizza item para aplicar em cada uma dos elentos                     
                      pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

                      //pega informações de 'id' das pizzas js
                      pizzaItem.setAttribute('data-key' , index);

                      //dispara evento de click na tela
                      pizzaItem.querySelector('a').addEventListener
                      ('click',
                        (e)=>{
                           e.preventDefault();//preventDefault=previna a ação padrão;
                           
                           c('.pizzaWindowArea').style.opacity = 0;

                           c('.pizzaWindowArea').style.display ='flex';

                           setTimeout//Executa um bloco específico uma vez depois de um determinado tempo
                           (
                               ()=>
                                {
                                 c('.pizzaWindowArea').style.opacity = 1;//define a transparencia
                                },200
                           );

                           //mostra o item que foi clicado e coloca as innformações na janela
                           let key  = e.target.closest('.pizza-item').getAttribute('data-key')//target =  no propio elemento; closest = acha o elemento mais prossimo  de 'pizza item'; getAttribute=pega o atributo do elemento;
                           c('.pizzaBig img').src = pizzaJson[key].img;
                           c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
                           c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
                           c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;

                           //tamanhos pizza na janela
                           c('.pizzaInfo--size.selected').classList.remove('selected')//O Element.classList é uma propriedade somente leitura que retorna uma coleção DOMTokenList ativa dos atributos de classe do elemento.
                           cs('.pizzaInfo--size').forEach//O metodo forEach() executa uma dada função em cada elemento de um array.
                           (
                             
                            (size , sizeIndex)=>
                            {

                              if(sizeIndex == 2)
                              {
                                  size.classList.add('selected')
                              }

                              size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];

                            }
                           
                           )

                           //quantiidade pizza
                           modalQt = 1;
                           modalKey = key;
                           c('.pizzaInfo--qt').innerHTML = modalQt;


                        }
                      );

                      //coloca os items em gerau na tela
                      c('.pizza-area').append(pizzaItem);//append:adiciona um elemento no outro;
                      
    }                  

);

//Eventos do  Modal

//fecha a tela
function closeModal()
{
  c('.pizzaWindowArea').style.opacity = 0;
  setTimeout
  ( 
    ()=>
     {
      c('.pizzaWindowArea').style.display = 'none';
     },500
  );
}
cs(' .pizzaInfo--cancelButton , .pizzaInfo--cancelMobileButton').forEach//foreach = cada uma dos elementos
(
(item)=>{

  item.addEventListener('click', closeModal)

}
)

//aumenta e diminui
c('.pizzaInfo--qtmenos').addEventListener('click',

()=>{
 if(modalQt > 1)
  {
    modalQt-- //= modalQt - 1 ;
    c('.pizzaInfo--qt').innerHTML = modalQt ;
  }

}

);
c('.pizzaInfo--qtmais').addEventListener('click',

()=>{
  if(modalQt < 24)
  {
    modalQt++
    c('.pizzaInfo--qt').innerHTML = modalQt ;
  }else
  {
    modalQt = 24
  }
}

);

//muda o tamanho do elemento
cs('.pizzaInfo--size').forEach(

  (size , sizeIndex)=>{
    size.addEventListener('click',
      
      (e)=>{
        c('.pizzaInfo--size.selected').classList.remove('selected'),
        size.classList.add('selected');
      }
      
    )
  }
)

//adiciona a lista
c('.pizzaInfo--addButton').addEventListener('click' , 

()=>
{//o parse int transforma em numero inteiro
       let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));//getAttribute() retorna o valor de um argumento específico do elemento.  

       let  identifier = pizzaJson[modalKey].id+'@'+size;

       let key = cart.findIndex(
       (item)=>
       {
          return item.identifier == identifier
       }
       );

       if(key > -1) {//se ele achou ele só muda a quantidade
        cart[key].qt += modalQt ;
       }else{//se ele não achou ele só coloca no carrinho

        cart.push({//O método push() adiciona um ou mais elementos ao final de um array e retorna o novo comprimento desse array.
         id:pizzaJson[modalKey].id,//qual a  pizza
         size,
         qt:modalQt

        });

       }
       updateCart();
       closeModal();
}

);

//abri o carrinho
c('.menu-openner').addEventListener('click',

()=>
{
  if(cart.length > 0 )
  {
   c('aside').style.left = '0' ;
  }
}

)
c('.menu-openner').style.cursor = 'pointer';
//fecha carrinho
c('.menu-closer').addEventListener('click' , 

()=>
{
c('aside').style.left = '100vw' ;
}

)
c('.menu-closer').style.cursor = 'pointer';

function updateCart()
{
   c('.menu-openner span').innerHTML = cart.length ;

   if(cart.length > 0)//A propriedade length tem como responsabilidade retornar a quantidade de caracteres de uma string ou o tamanho de um array. 
   {
       c('aside').classList.add('show');
       c('.cart').innerHTML = '';//com isso ele vai ter sempre que zerar antes de mostrar um novo item

       let subtotal = 0 ;
       let desconto = 0 ;
       let total = 0 ;

       for(let i in cart)
       {

         let pizzaItem = pizzaJson.find(//O método find() retorna o valor do primeiro elemento do array que satisfizer a função de teste provida. 
              (item)=>
              {
                  return item.id == cart[i].id;
              }
         )

          subtotal += pizzaItem.price * cart[i].qt;

         let cartItem = c('.models .cart--item').cloneNode(true);
         c('.cart').append(cartItem);
         let pizzaSizeName;
         switch(cart[i].size) 
         {
           case 0 :
              pizzaSizeName ='P';
           break;
           case 1 :
              pizzaSizeName ='M' ;
           break;
           case 2 :
              pizzaSizeName = 'G';
           break;
         }
         let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;
         cartItem.querySelector('img').src = pizzaItem.img;
         cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
         cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;

         //suubtrai itens no carrinho
         cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', 

         ()=>
         {
           if(cart[i].qt > 1){
               cart[i].qt--
           }
           else
           {
             cart.splice(i , 1);//[splice() = emendar unir juntar]splice() altera o conteúdo de uma lista, adicionando novos elementos enquanto remove elementos antigos.
           }
            updateCart();
         }
         
         )
         //soma itens no carrinho
         cartItem.querySelector('.cart--item-qtmais').addEventListener('click', 

         ()=>
         {
            cart[i].qt++
            updateCart();
         }
         
         )

      }

       desconto = subtotal * 0.1;
       total = subtotal - desconto;

       c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
       c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
       c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

   }
   else
   {
       c('aside').classList.remove('show');
       c('aside').style.left = '100vw' ;
   } 
}

