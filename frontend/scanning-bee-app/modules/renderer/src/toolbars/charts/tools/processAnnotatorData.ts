import { CellContentDto, UserDto } from '@frontend/controllers/backendInterface/payloadTypes';
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
export const processAnnotatorData = (data: CellContentDto[], users: UserDto[], startTime: Date, endTime: Date): AnnotatorChartData[] => {
    if (!data || !users) return [];

    const final: AnnotatorChartData[] = [];

    let activeTimeCell: number = -1;

    // sort the data
    const sortedFilteredData: CellContentDto[] = data
        .filter((cellContent) => {
            const cellDate = new Date(cellContent.timestamp);
            return (!startTime || cellDate >= startTime) && (!endTime || cellDate <= endTime);
        })
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    Object.values(sortedFilteredData).forEach((cellContent) => {
        const cell = (new Date(cellContent.timestamp)).toDateString();
        const timeCellExists = activeTimeCell !== -1 && final[activeTimeCell]!.name === cell;
        const user = users.find(u => u.id === cellContent.user);

        if (!timeCellExists) {
            activeTimeCell++;

            const pushed: AnnotatorChartData = { name: cell! } as AnnotatorChartData;
            users.forEach((u: UserDto) => {
                pushed[u.username] = 0;
            });
            final.push(pushed);
        }

        final[activeTimeCell]![user.username]++;
    });

    return final;
};
