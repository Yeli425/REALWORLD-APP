describe('practice',() =>{



it('practice', ()=>{

    cy.intercept('POST','https://conduit-api.bondaracademy.com/api/articles/').as('postArticle')
cy.visit('https://conduit.bondaracademy.com/')

cy.contains(' Sign in ').click()
cy.get('[placeholder="Email"]').type('elzatlebron@gmail.com')
cy.get('[placeholder="Password"]').type('elzatlebron')
cy.get('[class="btn btn-lg btn-primary pull-xs-right"]').click()
cy.contains(' New Article ').click()
cy.get('[formcontrolname="title"]').type('New Title')
cy.get('[formcontrolname="description"]').type('this is a description')
cy.get('[formcontrolname="body"]').type('this is a body of the article')
cy.contains('Publish Article').click()


cy.wait('@postArticle').then( xhr=>{

console.log(xhr)
expect(xhr.response.statusCode).to.equal(201)
expect(xhr.response.body.article.body).to.equal('this is a body of the article')


})


})

it.only('intercepting and modyfing the request and response', ()=>{

    cy.intercept('POST','https://conduit-api.bondaracademy.com/api/articles/', (req)=>{
    req.reply(res =>{
    expect(res.body.article.description).to.equal('this is a description')
    res.body.article.description= "this is a description 2"
    })
    }).as('postArticle')
    cy.visit('https://conduit.bondaracademy.com/')
    cy.contains(' Sign in ').click()
    cy.get('[placeholder="Email"]').type('elzatlebron@gmail.com')
    cy.get('[placeholder="Password"]').type('elzatlebron')
    cy.get('[class="btn btn-lg btn-primary pull-xs-right"]').click()
    
    cy.contains('New Article').click()
    cy.get('[formcontrolname="title"]').type('New Title')
    cy.get('[formcontrolname="description"]').type('this is a description')
    cy.get('[formcontrolname="body"]').type('this is a body of the article')
    cy.contains('Publish Article').click()
    
    cy.wait('@postArticle').then( xhr => {
      console.log(xhr)
      expect(xhr.response.statusCode).to.equal(201)
      expect(xhr.request.body.article.body).to.equal('this is a body of the article')
      expect(xhr.response.body.article.description).to.equal('this is a description 2')
    
    })
})




})