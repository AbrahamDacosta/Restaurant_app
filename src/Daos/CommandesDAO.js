import {
    ACCEPT_COMMANDE,
    AFFECT_LIVREUR,
    DENIED_COMMANDE,
    EDIT_ORDER_FOR_MISSING_PRODUCT,
    GET_CANCEL_REASON,
    GET_COMMANDES,
    GET_DEMANDES_INTERVENTION,
    GET_EDITED_ORDER_DETAILS,
    GET_ORDER_DETAILS,
    GET_RIDER_POSITION,
    ORDER_READY,
    POST_DEMANDE_INTERVENTION,
} from '../api/routes';
import axios from 'axios';

export default class CommandesDAO {

    async getRiderPositionByCommande(reference) {
        return (
            await axios.get(
                GET_RIDER_POSITION, {
                params: { reference }
            }
            )
        ).data
    }

    async getCancelReason() {
        return (
            await axios.get(
                GET_CANCEL_REASON
            )
        ).data
    }

    async getCommandeByType({ states, page, id_store, startDate, endDate }) {
        return (
            await axios.get(GET_COMMANDES, {
                params: {
                    id_store,
                    etat: states, page,
                    date_debut: startDate, date_fin: endDate
                }
            })
        ).data;
    }

    async getOrderDetails(reference, noEditedNeeded) {

        const details = (
            await axios.get(GET_ORDER_DETAILS, {
                params: { reference }
            })
        ).data;

        // return details;


        // if (details.old_order_amount == null || parseInt(details.old_order_amount) == 0 || noEditedNeeded == true)
        //     return details;

        if (details.old_order_amount == null || parseInt(details.old_order_amount) == 0 || noEditedNeeded == true)
            return details;

        const editedOrder =  await this.getEditedOrderDetails(reference);
        details.old = editedOrder;

        return details;

        return await this.getEditedOrderDetails(reference)
    }

    async getEditedOrderDetails(reference) {

        return (
            await axios.get(GET_EDITED_ORDER_DETAILS, {
                params: { reference }
            })
        ).data
    }

    async acceptCommande(reference) {

        return (
            await axios.get(ACCEPT_COMMANDE, {
                params: { reference }
            })
        ).data
    }

    async declineCommande(reference, cancel_reason) {

        return (
            await axios.get(DENIED_COMMANDE, {
                params: { reference, cancel_reason }
            })
        ).data
    }

    async affectLivreur(reference) {

        console.log("Affect livreur reference=>" + reference);

        return (
            await axios.get(AFFECT_LIVREUR, {
                params: { reference }
            })
        ).data
    }

    async orderReady(reference) {

        return (
            await axios.get(
                ORDER_READY, {
                params: { reference }
            }
            )
        );
    }

    async updateAvailableCommandes(reference, newCart) {

        let formData = new FormData();


        // formData.append('raze', "reference");
        // formData.append('available_product', JSON.stringify(
        //     newCart.map(
        //         cartItem => ({
        //             order_item_id: cartItem.id,
        //             quantity: cartItem.quantity
        //         })
        //     )
        // ));

        console.log(formData);

        return (
            await axios.post(EDIT_ORDER_FOR_MISSING_PRODUCT,
                {
                    reference,
                    available_products: JSON.stringify(
                        newCart.map(
                            cartItem => ({
                                order_item_id: cartItem.id,
                                quantity: cartItem.quantity
                            })
                        )
                    )
                },
                {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            )
        ).data;
    }

}
