import * as React from "react";
import * as moment from "moment";

interface Props {
    timestamp: number;
}

function getTimeString(timestamp: number) {
    const sec = moment
        .unix(Date.now() / 1000)
        .diff(moment.unix(timestamp), "seconds");
    return `${sec} seconds ago`;
}

export default function LastAgo({ timestamp, ...props }: Props) {
    if (!timestamp) {
        return <span>(unavailable)</span>;
    }

    const [timeString, setTimeString] = React.useState(
        getTimeString(timestamp)
    );

    React.useEffect(() => {
        const timer = setInterval(() => {
            if (timestamp) {
                setTimeString(getTimeString(timestamp));
            }
        }, 1000);
        return () => clearInterval(timer);
    });

    return <span>{timeString}</span>;
}
