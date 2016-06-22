/**
 * Contains information about a SQL parameter being passed to the statement
 * along with the request.
 */
interface ISqlParameter {
    /**
     * The name of the parameter.
     */
    Name: string;
    
    /**
     * The parameter type.
     */
    Type: string;
    
    /**
     * The value of the parameter.
     */
    Value: any;
}

export default ISqlParameter;