const button = document.getElementById('send-button')
const input = document.getElementById('message-input')
const outputArea = document.querySelector('.output-area')
const app = document.querySelector('.app')
const loading = document.getElementById('loading')
const instructionsList = document.querySelector('.output-instructions-list')
const productsTable = document.querySelector('.output-products-table')

import { GoogleGenerativeAI } from '@google/generative-ai'

const API_KEY = 'AIzaSyA5iXmhJlCTuV9nvi0DJsoGHuLFm64S_HY'

const genAI = new GoogleGenerativeAI(API_KEY)

const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

const handleOutputModel = (output) => {
  output = output.replace(/\n/g, '')
  output = output.replace(/json/g, '')
  output = output.replace(/```/g, '')
  return output
}

button.onclick = async () => {
  loading.style.display = 'flex'
  app.style.display = 'none'
  const inputValue = input.value

  const prompt = `Hướng dẫn chăm sóc cây bệnh ${inputValue} với các yêu cầu sau:
  - Đầu ra: json với các keys lần lượt là "Hướng dẫn chăm sóc cây", "Sản phẩm chăm sóc cây tham khảo"
  - Với key "Hướng dẫn chăm sóc cây" thì value của nó là array chứa các bước chăm sóc cây (kiểu dữ liệu string)
  - Với key "Sản phẩm chăm sóc cây tham khảo" thì value của nó là array chứa các sản phẩm chăm sóc cây (kiểu dữ liệu string) theo định dạng "Loại sản phẩm: các sản phẩm của các hãng cụ thể"`

  const result = await model.generateContent(prompt)
  const response = await result.response
  const text = response.text()

  const outputObject = JSON.parse(handleOutputModel(text))

  console.log(outputObject)

  const instructions = outputObject['Hướng dẫn chăm sóc cây']
  const products = outputObject['Sản phẩm chăm sóc cây tham khảo']

  instructionsList.innerHTML = instructions
    .map((instruction) => {
      return `<li class="output-instructions-item">${instruction}</li>`
    })
    .join(' ')

  const headingRow = `<tr>
  <th>STT</th>
  <th>Loại sản phẩm</th>
  <th>Một số sản phẩm tham khảo</th>
</tr>`

  productsTable.innerHTML =
    headingRow +
    products
      .map((product, index) => {
        const [productType, examples] = product.split(': ')
        return `
          <tr>
              <td>${index + 1}</td>
              <td>${productType}</td>
              <td>${examples}</td>
          </tr>`
      })
      .join(' ')
  loading.style.display = 'none'
  app.style.display = 'flex'
  outputArea.style.display = 'block'
}
