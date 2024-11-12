describe('Test with backend', () => {

  beforeEach('login to application', () =>{
    cy.intercept({method: 'GET', path: 'tags'}, {fixture: 'tags.json'})
    cy.loginToApplication()
  })


    it.only('verify correct resquest and response', () =>{

      //need to be before the actual browser make
      cy.intercept('POST', '**/articles').as('postArticle')


        cy.contains('New Article').click()
        cy.get('[formcontrolname="title"]').type('New Title')
        cy.get('[formcontrolname="description"]').type('this is a description')
        cy.get('[formcontrolname="body"]').type('this is a body of the article')
        cy.contains('Publish Article').click()

        cy.wait('@postArticle').then( xhr => {
          console.log(xhr)
          expect(xhr.response.statusCode).to.equal(201)
          expect(xhr.response.body.article.body).to.equal('this is a body of the article')
          expect(xhr.response.body.article.description).to.equal('this is a description')

        })
    })

    it('intercepting and modyfing the request and response', () =>{

      //need to be before the actual browser make
      // cy.intercept('POST', '**/articles', (req) =>{
      //   req.body.article.description = "This is a description 2"
      // }).as('postArticle')

      cy.intercept('POST', '**/articles', (req) =>{
          req.reply(res =>{
            expect(res.body.article.description).to.equal('this is a description')
            res.body.article.description= "this is a description 2"
          })
         }).as('postArticle')

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

    it('verify popular tags are displayed', () =>{
      cy.get('.tag-list')
      .should('contain', 'cypress')
      .and('contain', 'testing')
      .and('contain', 'automation')
    })


    it('verify global feed likes count', () =>{
      cy.intercept('GET', 'https://conduit-api.bondaracademy.com/api/articles/feed*', {"articles":[],"articlesCount":0})
      cy.intercept('GET','https://conduit-api.bondaracademy.com/api/articles*', {fixture : 'articles.json'})

      cy.contains('Global Feed').click()
      cy.get('app-article-list button').then( heartList =>{
        expect(heartList[0]).to.contain('6')

      })

      cy.fixture('articles.json').then(file => {
        const articleLink =  file.articles[0].slug
        file.articles[0].favoritesCount =6
        cy.intercept('POST', 'https://conduit-api.bondaracademy.com/api/articles/'+articleLink+'/favorite', file)
 
      })
      cy.get('app-article-list button').eq(0).click().should('contain', '7')
      }
 
    )

    it("delete a new article in al global feed", () =>{

      const bodyRequest= {
        "article": {
            "title": "Request from API",
            "description": "API testing is easy ",
            "body": "this is lebron's page",
            "tagList": []
        }
    }
     cy.get('@token').then(token =>{
        
        cy.request({
          url: Cypress.env('apiUrl')+ '/api/articles/',
          headers: {'Authorization': 'Token '+token},
          method: 'POST',
          body: bodyRequest
        }).then( response =>{
          expect(response.status).to.equal(201)
        })
        cy.contains('Global Feed').click()
        cy.get('.preview-link').first().click()
        cy.get('.article-actions').contains(' Delete Article ').click()


        cy.request({
          url: Cypress.env('apiUrl')+ '/api/articles?limit=10&offset=0',
          headers: {'Authorization': 'Token '+token},
          method: 'GET',
        }).its('body').then(body =>{
          expect(body.articles[0].title).not.to.equal('Request from API')
        })
       })

    })
    

})