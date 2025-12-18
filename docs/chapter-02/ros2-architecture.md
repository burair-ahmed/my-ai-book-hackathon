---
sidebar_label: 2.1 ROS 2 Architecture
sidebar_position: 2
---

# 2.1 ROS 2 Architecture

## Component-Based Design

ROS 2 implements a component-based architecture that enables modular, scalable robotic systems. This section explores the fundamental architectural patterns that make ROS 2 suitable for embodied intelligence systems.

## Core Concepts

### Nodes
Nodes are the fundamental computational units in ROS 2:

- **Process isolation**: Each node runs as a separate process
- **Modular design**: Nodes can be developed, tested, and deployed independently
- **Fault isolation**: Node failures don't necessarily crash the entire system
- **Resource management**: Independent memory and CPU allocation

### Discovery Mechanism
ROS 2 uses DDS-based discovery for automatic system configuration:

- **Dynamic discovery**: Nodes automatically find each other on the network
- **Zero configuration**: No manual IP address or port configuration required
- **Quality of Service (QoS) negotiation**: Automatic compatibility checking
- **Security integration**: Built-in authentication and encryption support

## DDS Middleware Layer

### Data Distribution Service
DDS provides the communication backbone for ROS 2:

#### Publish-Subscribe Pattern
```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import String

class PublisherNode(Node):
    def __init__(self):
        super().__init__('publisher_node')
        self.publisher = self.create_publisher(String, 'topic', 10)
        self.timer = self.create_timer(1.0, self.timer_callback)

    def timer_callback(self):
        msg = String()
        msg.data = 'Hello, ROS 2!'
        self.publisher.publish(msg)
        self.get_logger().info('Published: "%s"' % msg.data)
```

#### Quality of Service Profiles
ROS 2 defines standard QoS profiles for different use cases:

- **Sensor Data**: High reliability, low latency
- **System State**: High reliability, durable
- **Control Commands**: High reliability, transient local
- **Debugging**: Best effort, volatile

### Lifecycle Management
ROS 2 provides structured lifecycle management for nodes:

```python
class LifecycleNode(Node):
    def __init__(self):
        super().__init__('lifecycle_node')

    def on_configure(self, state):
        # Initialize resources
        self.get_logger().info('Configuring...')
        return TransitionCallbackReturn.SUCCESS

    def on_activate(self, state):
        # Start processing
        self.get_logger().info('Activating...')
        return TransitionCallbackReturn.SUCCESS

    def on_deactivate(self, state):
        # Stop processing
        self.get_logger().info('Deactivating...')
        return TransitionCallbackReturn.SUCCESS

    def on_cleanup(self, state):
        # Release resources
        self.get_logger().info('Cleaning up...')
        return TransitionCallbackReturn.SUCCESS

    def on_shutdown(self, state):
        # Emergency shutdown
        self.get_logger().info('Shutting down...')
        return TransitionCallbackReturn.SUCCESS
```

## Communication Patterns

### Topics
Named communication channels for publish-subscribe messaging:

- **Asynchronous communication**: Publishers and subscribers operate independently
- **Many-to-many relationships**: Multiple publishers and subscribers per topic
- **Type safety**: Messages have defined data structures
- **QoS compatibility**: Publisher-subscriber pairs negotiate QoS settings

### Services
Request-response communication pattern:

- **Synchronous communication**: Client waits for service response
- **One-to-one relationships**: Single service provider, multiple clients
- **Complex operations**: Services can perform multi-step operations
- **Error handling**: Services can return success/failure status

### Actions
Long-running operation management:

- **Goal-directed operations**: Clients send goals to action servers
- **Progress feedback**: Servers provide ongoing status updates
- **Cancellation support**: Clients can cancel running actions
- **Result delivery**: Final outcomes returned to clients

## Real-time Considerations

### Real-time Executor
ROS 2 provides real-time scheduling capabilities:

```python
import rclpy
from rclpy.executors import SingleThreadedExecutor

def main():
    rclpy.init()

    # Create nodes
    node1 = SensorProcessingNode()
    node2 = ControlNode()

    # Use real-time executor
    executor = SingleThreadedExecutor()
    executor.add_node(node1)
    executor.add_node(node2)

    try:
        executor.spin()
    finally:
        executor.shutdown()
        rclpy.shutdown()
```

### Priority-based Scheduling
ROS 2 supports thread priority management:

- **Thread priorities**: Control execution priority of different nodes
- **Real-time scheduling**: Integration with OS real-time schedulers
- **Deadline management**: Ensure critical operations meet timing constraints
- **Resource allocation**: CPU core affinity and memory management

## Security Architecture

### DDS Security
ROS 2 integrates DDS security features:

- **Authentication**: Node identity verification
- **Access control**: Topic and service access permissions
- **Encryption**: Data-in-transit protection
- **Integrity**: Message tampering detection

### Secure Discovery
Automatic secure node discovery:

```yaml
# ROS 2 security configuration
security:
  enabled: true
  authentication:
    ca_certificate: /path/to/ca.pem
    certificate: /path/to/cert.pem
    private_key: /path/to/key.pem
  access_control:
    permissions: /path/to/permissions.p7s
  cryptography:
    plugin: builtin
```

## Cross-Platform Compatibility

### Supported Platforms
ROS 2 runs on multiple operating systems:

- **Linux**: Primary development and deployment platform
- **macOS**: Development and simulation platform
- **Windows**: Development platform with some limitations
- **Real-time OS**: Integration with QNX, VxWorks, and other RTOS

### Container Support
ROS 2 works well with container technologies:

- **Docker**: Isolated development environments
- **Podman**: Alternative container runtime
- **Kubernetes**: Orchestrated deployment at scale

## Performance Characteristics

### Latency Analysis
ROS 2 communication latency depends on multiple factors:

- **Intra-process**: &lt;1μs (same process communication)
- **Inter-process**: 10-100μs (same machine)
- **Network**: 100μs-1ms (local network)
- **QoS impact**: Reliability settings affect latency

### Throughput Benchmarks
ROS 2 can achieve high message throughput:

- **Small messages**: 100,000+ messages/second
- **Large messages**: Limited by network bandwidth
- **QoS trade-offs**: Reliability reduces maximum throughput
- **Hardware limits**: CPU and network constraints apply

## Integration Patterns

### Legacy System Integration
ROS 2 provides bridges for integration with ROS 1:

```bash
# Install ROS 1 bridge
sudo apt install ros-humble-ros1-bridge

# Run bridge between ROS 1 and ROS 2
ros2 run ros1_bridge dynamic_bridge
```

### External System Integration
Integration with non-ROS systems:

- **REST APIs**: HTTP-based communication with web services
- **WebSocket**: Real-time bidirectional communication
- **Serial protocols**: Direct hardware communication
- **Database integration**: Persistent data storage and retrieval

## Conclusion

ROS 2's architecture provides a solid foundation for embodied intelligence systems. The component-based design, DDS middleware, and real-time capabilities make it well-suited for the demands of physical AI applications. Understanding these architectural principles is essential for building reliable, scalable robotic systems.

The next section will explore practical ROS 2 development workflows and tools that bring this architecture to life.
