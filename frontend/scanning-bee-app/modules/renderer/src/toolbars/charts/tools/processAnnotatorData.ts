import Annotation from '@frontend/models/annotation';

export type AnnotatorData = {
    [username: string]: Annotation[];
};

export type AnnotatorChartData = {
    name: string;
    data: { [key: string]: number };
};

/**
 * processes the annotator data. takes annotator data and returns a chart data.
 * converts the user and annotation data that comes from the backend to a format that can be used by the chart.
 * the format is as follows:
 * {
 *  name: < string representation of the day >,
 *  [username]: < number of annotations by that user on that day >,
 * }
 * @param data
 */
export const processAnnotatorData = (data: AnnotatorData): AnnotatorChartData[] => {
    if (!data) return [];

    const usernames = Object.keys(data);

    if (usernames.length === 0) return null;

    const final: AnnotatorChartData[] = [];

    let activeTimeCell: number = -1;

    // sort the data
    const sortedData: AnnotatorData = {};

    Object.keys(data).forEach((username) => {
        sortedData[username] = data[username].sort((a, b) => a.timestamp - b.timestamp);
    });

    Object.values(sortedData).forEach((log) => {
        const cell = (new Date(log[0].timestamp)).toDateString();
        const timeCellExists = activeTimeCell !== -1 && final[activeTimeCell]!.name === cell;
        const username = log[0].created_by;

        console.log(username, cell, timeCellExists, activeTimeCell, final[activeTimeCell]);

        if (!timeCellExists) {
            activeTimeCell++;

            const pushed: AnnotatorChartData = { name: cell! } as AnnotatorChartData;
            usernames.forEach((u: string) => {
                pushed[u] = 0;
            });
            final.push(pushed);
        }

        final[activeTimeCell]![username]++;
    });

    return final;
};
