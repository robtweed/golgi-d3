# Golgi WebComponent Library for D3-based Node Visualisation
 
Rob Tweed <rtweed@mgateway.com>  
1 December 2023, MGateway Ltd [http://www.mgateway.com](http://www.mgateway.com)  

Twitter: @rtweed

Google Group for discussions, support, advice etc: [http://groups.google.co.uk/group/enterprise-web-developer-community](http://groups.google.co.uk/group/enterprise-web-developer-community)

# About This Repository

This repository contains a library of [Golgi](https://github.com/robtweed/golgi) WebComponents that
can be used as building blocks to implement a user interface that graphically visualises a 
hierarchy of nodes.  

This is particularly useful for visualising Global Storage databases, and an example for this is included.

# Dependencies

This Component Library has four dependencies, all of which are Open Source:

- [Golgi](https://github.com/robtweed/golgi)
- [The Bootstrap 5 Runtime](https://getbootstrap.com/)
- [The Feather icon library](https://feathericons.com/)
- [The D3 Data Visualisation library](https://d3js.org/)

Note that the top-level *golgi-d3* WebComponent uses Shadow DOM and is therefore self-contained in terms of styling.

# Check it Out

See the [*/example*](./example) folder in this repository.


# Getting Started

Golgi-based applications do not require any bundling/compilation step or complex build-chain tooling: they are designed to dynamically fetch what's needed when needed by making use of JavaScript ES6 Modules.

So all you need is a web server to which you can upload files and you're good to go.

----

# License

 Copyright (c) 2023 MGateway Ltd,                           
 Redhill, Surrey UK.                                                      
 All rights reserved.                                                     
                                                                           
  http://www.mgateway.com                                                  
  Email: rtweed@mgateway.com                                               
                                                                           
                                                                           
  Licensed under the Apache License, Version 2.0 (the "License");          
  you may not use this file except in compliance with the License.         
  You may obtain a copy of the License at                                  
                                                                           
      http://www.apache.org/licenses/LICENSE-2.0                           
                                                                           
  Unless required by applicable law or agreed to in writing, software      
  distributed under the License is distributed on an "AS IS" BASIS,        
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
  See the License for the specific language governing permissions and      
   limitations under the License. 
