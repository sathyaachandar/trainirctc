import { LightningElement, track } from 'lwc';
import getTrainSchedule from '@salesforce/apex/TrainScheduleController.getTrainSchedule';

export default class TrainSchedule extends LightningElement {
    @track trainNo = '';
    @track trainData;
    @track error;

    handleInputChange(event) {
        this.trainNo = event.target.value;
    }

    fetchTrainSchedule() {
        if (this.trainNo) {
            getTrainSchedule({ trainNo: this.trainNo })
                .then(result => {
                    const response = JSON.parse(result);
                    if (response.status) {
                        this.trainData = {
                            trainName: response.data.train_name,
                            type: response.data.type.toUpperCase(),
                            origin: response.data.origin.station_name,
                            destination: response.data.destination.station_name,
                            distance: response.data.distance
                        };
                        this.error = undefined;
                    } else {
                        this.error = 'No data found for the provided train number.';
                        this.trainData = undefined;
                    }
                })
                .catch(error => {
                    this.error = error.body?.message || 'An error occurred while fetching the train schedule.';
                    this.trainData = undefined;
                });
        } else {
            this.error = 'Please enter a valid train number.';
        }
    }
}
