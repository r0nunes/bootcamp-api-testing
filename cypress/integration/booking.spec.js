/// <reference types="cypress" />

import req from '../support/api/requests'
import schemas from '../support/api/schemas'
import assertions from '../support/api/assertions'

context('Booking', () => {
    before(() => { 
        req.doAuth()
    });


    it('Validar o contrato do GET Booking @contract', () => {
        
        req.getBooking().then(getBookingReponse => { 
            assertions.validateContractOf(getBookingReponse, schemas.getBookingSchema())
         
        })
    });

    it('Criar uma reserva com sucesso @functional', () => {
        cy.request({
            method: 'POST',
            url: '/booking',
            body: {
                "firstname" : "Jim",
                "lastname" : "Brown",
                "totalprice" : 111,
                "depositpaid" : true,
                "bookingdates" : {
                    "checkin" : "2020-01-01",
                    "checkout" : "2020-01-02"
                },
                "additionalneeds" : "Breakfast"
            },
        }).then(postBookingResponse => { 
            expect(postBookingResponse.status).to.eq(200)

            expect(postBookingResponse.body.bookingid, 'bookingid exists').to.not.be.null;
            expect(postBookingResponse.headers, 'default headers').to.include({ 
                server: 'Cowboy',
                connection: 'keep-alive',
                'x-powered-by': 'Express'
            })

            expect(postBookingResponse.headers, 'content type').to.include({ 
                'content-type': 'application/json; charset=utf-8'
            })

            expect(postBookingResponse.duration, 'response duration').lt(900);
        })

    });

    it('Criar uma reserva com sucesso @functional', () => {
        req.postBooking().then(postBookingResponse => { 
            assertions.shouldHaveStatus(postBookingResponse, 200)
            assertions.shouldBookingBePresent(postBookingResponse)
            assertions.shouldHaveDefaultHeaders(postBookingResponse)
            assertions.shouldHaveContentTypeAppJson(postBookingResponse)
            assertions.shouldDurationBeFast(postBookingResponse)
        })
    })

    it('Alterar uma reserva com token inválido @functional', () => {
        req.postBooking().then(postBookingResponse => { 
            req.updateBookingWithoutToken(postBookingResponse).then(putBookingResponse => { 
                assertions.shouldHaveStatus(putBookingResponse, 403)
            })
        })
    });

    it('Alterar uma reserva inexistente @functional', () => {
        req.updateBookingWithoutId().then(putBookingResponse => { 
            assertions.shouldHaveStatus(putBookingResponse, 405)
        })
    });
    
    it('Alterar uma reserva com sucesso @functional', () => {
        req.postBooking().then(postBookingResponse => { 
            req.updateBooking(postBookingResponse).then(putBookingResponse => { 
                assertions.shouldHaveStatus(putBookingResponse, 200)
            })
        })
    });

    it('Excluir uma reserva com sucesso @functional', () => {
        req.postBooking().then(postBookingResponse => { 
            req.deleteBooking(postBookingResponse).then(deleteBookingResponse => { 
                assertions.shouldHaveStatus(deleteBookingResponse, 201)
            })
        })
    });

    it('Excluir uma reserva inexistente @functional', () => {
        req.deleteBookingWithoutId().then(deleteBookingResponse => { 
            assertions.shouldHaveStatus(deleteBookingResponse, 405 )
        })
    })

    it.only('Excluir uma reserva com sucesso @functional', () => {
        req.postBooking().then(postBookingResponse => { 
            req.deleteBookingInvalidToken(postBookingResponse).then(deleteBookingResponse => { 
                assertions.shouldHaveStatus(deleteBookingResponse, 403)
            })
        })
    });


    
}); 
