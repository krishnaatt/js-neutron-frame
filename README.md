<a name="js-neutron-frame"></a>
<!--
*** Thanks for checking out the js-neutron-frame project. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->

[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a> </li>
    <li><a href="#getting-started">Getting Started</a></li>
    <li><a href="#documentation-and-examples">Documentation and Examples</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
### About The Project

"js-neutron-frame" is a powerful library written in TypeScript designed to provide data manipulation and statistical analysis capabilities, akin to Python's Pandas library, but tailored specifically for JavaScript/TypeScript and Node.js applications. The library offers a flexible and efficient way to work with tabular data, enabling developers to perform data transformations, statistical calculations, and more, all within the JavaScript ecosystem.

Key Features:

**Data Manipulation**: With "js-neutron-frame", you can effortlessly work with data in tabular format, treating it like a spreadsheet. The library supports adding, updating, and deleting rows and columns, making data manipulation a breeze.

**Statistical Analysis**: "js-neutron-frame" comes equipped with a rich set of statistical functions. Perform operations such as calculating mean, median, mode, and standard deviation on columns or the entire DataFrame, gaining valuable insights from your data.

**Data Import and Export**: Easily import data from CSV and Excel files, ensuring seamless integration with your existing datasets. The library empowers you to export results and processed data back to various file formats with ease.

**Dynamic Column Handling**: When using the addRow function, "DataFrame.js" dynamically adjusts columns based on the provided data. New columns are automatically created if the keys in the provided row data do not exist in the current columns.

**Flexible and Lightweight**: Built with modern JavaScript, "DataFrame.js" offers a lightweight and versatile solution for data analysis. It is optimized for speed and memory efficiency, making it suitable for both small and large datasets.

**Easy Integration**: As an npm module, "DataFrame.js" is readily available for integration into any JavaScript or Node.js project. Simply install the package and start harnessing its data manipulation capabilities right away.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- GETTING STARTED -->
### Getting Started

This is walkthrough of how the library can be installed/

#### Prerequisites and Installation

1. Install **Node.js** and **npm**
2. For **TypeScript** projects, install TypeScript [This step is not required for JavaScript projects]
```
npm install typescript --save-dev
```
3. Install the library from npm modules:
```
npm install js-neutron-frame
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- DOCUMENTATION AND EXAMPLES -->
### Documentation and Examples

#### import the library
```
import { DataFrame, readCSV } from "js-neutron-frame";
```
#### Create DataFrame
1. Create an empty DataFrame:
```
const df = new DataFrame();
```
___
2. Create DataFrame by reading from .csv file:
```
const df = await readCSV('./oscar_age_male.csv');
```
___

### DataFrame utilities
3. **addRows**(DataFrameRow): void
The keys refer to the columns
If a key is new, it is added to the columns
```
df.addRow({Index:1, Year: 1928, Age:44, Name:'Emil Jannings', Movie: 'The Last Command'});
df.addRow({Index:2, Year: 1929, Age:41, Name:'Warner Baxter', Movie: 'The Old Arizona'});
df.addRow({Index:3, Year: 1930, Age:62, Name:'George Arliss', Movie: 'Disraeli'});
df.addRow({Index:4, Year: 1931, Age:53, Name:'Lionel Barrymore', Movie: 'A Free Soul'});
```
___
4. **addColumns**(name: string, values: (number | string | boolean)[]): void
```
const BoxOffice = [50000, 60000, 75000];
df.addColumn('BoxOffice', salaryData);
```
___
5. **getShape**(): [row_size, column_size]
returns the [rows, columns] of the DataFrame
```
df.getShape();
```
Output:
``
[ 89, 5 ]
``
___

6. **filterByColums**(columnName: string, value: number | string | boolean): DataFrameRow[]
Takes columnName and the value that has to be matched as input.
This does simple plain matching and returns the filtered rows.
```
df.filterByColumn('Age', 44)
```
Output:
```
[
  {
    Index: 1,
    Year: 1928,
    Age: 44,
    Name: 'Emil Jannings',
    Movie: 'The Last Command'
  },
  {
    Index: 87,
    Year: 2014,
    Age: 44,
    Name: 'Matthew McConaughey',
    Movie: 'Dallas Buyers Club'
  }
]
```
___

7. **showFirstRows**(n: number = 5): DataFrameRow[]
Shows n rows from beggining.
Default 5 rows are shown if not specified.

```
const firstRows = df.showFirstRows(3);
```
Output:
```
[
  {
    Index: 1,
    Year: 1928,
    Age: 44,
    Name: 'Emil Jannings',
    Movie: 'The Last Command'
  },
  {
    Index: 2,
    Year: 1929,
    Age: 41,
    Name: 'Warner Baxter',
    Movie: 'In Old Arizona'
  },
  {
    Index: 3,
    Year: 1930,
    Age: 62,
    Name: 'George Arliss',
    Movie: 'Disraeli'
  }
]
```
___
8. **showLastRows**(n: number = 5): DataFrameRow[]
Shows n rows from last.
Default 5 rows are shown if not specified.
```
const lastRows = df.showLastRows(2)
```

Output:
```
[
  {
    Index: 3,
    Year: 1930,
    Age: 62,
    Name: 'George Arliss',
    Movie: 'Disraeli'
  },
  {
    Index: 4,
    Year: 1931,
    Age: 53,
    Name: 'Lionel Barrymore',
    Movie: 'A Free Soul'
  }
]
```
___

9. **getColumnDataTypes**(): { [key: string]: string }
returns the data types of the columns based on their values

```
df.getColumnDataTypes();
```
Output:
```
{
  Index: 'number',
  Year: 'number',
  Age: 'number',
  Name: 'string',
  Movie: 'string'
}
```
___

10. **renameColumn**(currentName: string, newName: string): void
Rename the currentName columns to the newName columns
```
df.renameColumn('Year', 'ExactYear');
```

___

11. **dropColumn**(columnName: string): void
Drops the column and its value
```
df.dropColumn('Index');
```
Output:
```
[
  {
    Year: 1928,
    Age: 44,
    Name: 'Emil Jannings',
    Movie: 'The Last Command'
  },
  {
    Year: 1929,
    Age: 41,
    Name: 'Warner Baxter',
    Movie: 'In Old Arizona'
  }
]
```

___

12. **selectColumns**(selectedColumns: string[]): DataFrame
Returns a new DataFrame with selected columns.
___

13. **where**(...conditions: string[]): DataFrame
Returns a filtered DataFrame where all the conditions are satisfied.
```
console.log(df.where([
    { column: 'Age', operator: '<=', value: 40 },
    { column: 'Year', operator: '>=', value: 2000 }
]));
```
Output:
```
DataFrame {
  data: [
    {
      Index: 73,
      Year: 2000,
      Age: 40,
      Name: 'Kevin Spacey',
      Movie: 'American Beauty'
    },
    {
      Index: 74,
      Year: 2001,
      Age: 36,
      Name: 'Russell Crowe',
      Movie: 'Gladiator'
    },
    {
      Index: 76,
      Year: 2003,
      Age: 29,
      Name: 'Adrien Brody',
      Movie: 'The Pianist'
    },
    {
      Index: 78,
      Year: 2005,
      Age: 37,
      Name: 'Jamie Foxx',
      Movie: 'Ray'
    },
    {
      Index: 79,
      Year: 2006,
      Age: 38,
      Name: 'Philip Seymour Hoffman',
      Movie: 'Capote'
    },
    {
      Index: 85,
      Year: 2012,
      Age: 39,
      Name: 'Jean Dujardin',
      Movie: 'The Artist'
    },
    {
      Index: 88,
      Year: 2015,
      Age: 33,
      Name: 'Eddie Redmayne',
      Movie: 'The Theory of Everything'
    }
  ],
  columns: [ 'Index', 'Year', 'Age', 'Name', 'Movie' ]
}
```
___

14. **sortBy**(columns: string[], directions: 'asc' | 'desc' | ('asc' | 'desc')[]): DataFrame
Returns a DataFrame sorted based on the given columns and order
___


### Statistical Opeartions on the Data
15. **mean**(column?: string): number
Returns the mean of a column if given, else of the entire DataFrame
```
df.mean()
```
___
16. **median**(column?: string): number
Returns the median of a column if given, else of the entire DataFrame
```
df.median()
```
___
17. **mode**(column?: string): any | any[]
Returns the mode of a column if given, else of the entire DataFrame
```
df.mode()
```
___
18. **std**(column?: string): number
Returns the standard deviation of a given column, else of the entir DataFrame
```
df.std()
```
___

_For more examples, please refer to the google doc [Documentation](https://example.com)_

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
### Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LICENSE -->
### License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
### Contact

Krishna Rao - [@KrishnaRaoBV](https://twitter.com/KrishnaRaoBV) - krishnaatt1999@gmail.com

Project Link: [https://github.com/krishnaatt/js-neutron-frame](https://github.com/krishnaatt/js-neutron-frame)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->
### Acknowledgments

Use this space to list resources you find helpful and would like to give credit to. I've included a few of my favorites to kick things off!

* [Choose an Open Source License](https://choosealicense.com)
* [GitHub Emoji Cheat Sheet](https://www.webpagefx.com/tools/emoji-cheat-sheet)
* [Img Shields](https://shields.io)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/krishna-rao-baa0b619b/
