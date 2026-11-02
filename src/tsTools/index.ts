interface  keys {
  name:string,
  age:number
}

type _key=keyof keys;

type maos<T>={
  [pro in keyof T as Exclude<pro,"age"> ]:T[pro]
};

let _obj:maos<keys>={
  name:"xiaomei",
}


type ExtractPii<Type>={
  [pro in keyof Type]:Type[pro] extends {pii:true}? true:false;
}

const user={
  name:{pii:true},
  age:{pii:false}
}

type _UserPii=ExtractPii<typeof user>;


function getPiiFields<T>(obj:T):ExtractPii<T>{
  const result={} as ExtractPii<T>; 
  for(const key in obj){
    if(obj[key] && typeof obj[key]==="object" && "pii" in obj[key]){
      result[key]=true as ExtractPii<T>[keyof T];
    }else{
      result[key]=false as ExtractPii<T>[keyof T];
    } 


  }  return result;
} 
const _piiFields=getPiiFields(user);

 type _types=Parameters<typeof getPiiFields>;